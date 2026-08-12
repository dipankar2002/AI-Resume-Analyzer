package com.resumeanalyzer.service;

import com.resumeanalyzer.entity.Job;
import com.resumeanalyzer.entity.JobSkill;
import com.resumeanalyzer.entity.Skill;
import com.resumeanalyzer.repo.JobRepository;
import com.resumeanalyzer.repo.JobSkillRepository;
import com.resumeanalyzer.repo.SkillRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
public class JobSkillService {

    private final JobRepository jobRepository;
    private final JobSkillRepository jobSkillRepository;
    private final SkillRepository skillRepository;

    public JobSkillService(
            JobRepository jobRepository,
            JobSkillRepository jobSkillRepository,
            SkillRepository skillRepository) {

        this.jobRepository = jobRepository;
        this.jobSkillRepository = jobSkillRepository;
        this.skillRepository = skillRepository;
    }

    @Transactional
    public int extractAndSaveSkills(Integer jobId) {

        Job job =
                jobRepository.findById(jobId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Job not found"
                                )
                        );

        String title =
                job.getTitle() != null
                        ? job.getTitle()
                        : "";

        String description =
                job.getDescription() != null
                        ? job.getDescription()
                        : "";

        String fullText =
                (title + " " + description)
                        .toLowerCase(Locale.ROOT);

        /*
         * Remove existing skills first.
         *
         * This makes re-extraction safe.
         */
        List<JobSkill> existingSkills =
                jobSkillRepository.findByJobJobId(jobId);

        if (!existingSkills.isEmpty()) {
            jobSkillRepository.deleteAll(existingSkills);
        }

        /*
         * Get all known skills from the database.
         */
        List<Skill> allSkills =
                skillRepository.findAll();

        List<DetectedSkill> detectedSkills =
                new ArrayList<>();

        /*
         * -----------------------------------------------------
         * SKILL DETECTION
         * -----------------------------------------------------
         */

        for (Skill skill : allSkills) {

            if (skill.getSkillName() == null) {
                continue;
            }

            String skillName =
                    skill.getSkillName()
                            .trim();

            if (skillName.isEmpty()) {
                continue;
            }

            if (!containsSkill(
                    fullText,
                    skillName
            )) {
                continue;
            }

            JobSkill.Importance importance =
                    determineImportance(
                            title,
                            description,
                            skillName
                    );

            detectedSkills.add(
                    new DetectedSkill(
                            skill,
                            importance
                    )
            );
        }

        if (detectedSkills.isEmpty()) {
            return 0;
        }

        /*
         * -----------------------------------------------------
         * WEIGHT CALCULATION
         * -----------------------------------------------------
         *
         * REQUIRED  = raw weight 20
         * PREFERRED = raw weight 10
         *
         * Then normalize everything to 100.
         */

        BigDecimal totalRawWeight =
                BigDecimal.ZERO;

        for (DetectedSkill detected :
                detectedSkills) {

            if (detected.importance()
                    == JobSkill.Importance.REQUIRED) {

                totalRawWeight =
                        totalRawWeight.add(
                                BigDecimal.valueOf(20)
                        );

            } else {

                totalRawWeight =
                        totalRawWeight.add(
                                BigDecimal.valueOf(10)
                        );
            }
        }

        /*
         * -----------------------------------------------------
         * SAVE JOB SKILLS
         * -----------------------------------------------------
         *
         * The final skill receives the remaining weight
         * so that the total is ALWAYS exactly 100.00.
         */

        BigDecimal assignedWeight =
                BigDecimal.ZERO;

        for (int i = 0;
             i < detectedSkills.size();
             i++) {

            DetectedSkill detected =
                    detectedSkills.get(i);

            BigDecimal normalizedWeight;

            /*
             * Give the final skill whatever weight is
             * necessary to make the total exactly 100.
             */
            if (i == detectedSkills.size() - 1) {

                normalizedWeight =
                        BigDecimal.valueOf(100)
                                .subtract(assignedWeight)
                                .setScale(
                                        2,
                                        RoundingMode.HALF_UP
                                );

            } else {

                BigDecimal rawWeight;

                if (detected.importance()
                        == JobSkill.Importance.REQUIRED) {

                    rawWeight =
                            BigDecimal.valueOf(20);

                } else {

                    rawWeight =
                            BigDecimal.valueOf(10);
                }

                normalizedWeight =
                        rawWeight
                                .divide(
                                        totalRawWeight,
                                        6,
                                        RoundingMode.HALF_UP
                                )
                                .multiply(
                                        BigDecimal.valueOf(100)
                                )
                                .setScale(
                                        2,
                                        RoundingMode.HALF_UP
                                );
            }

            assignedWeight =
                    assignedWeight.add(
                            normalizedWeight
                    );

            JobSkill jobSkill =
                    new JobSkill();

            jobSkill.setJob(job);

            jobSkill.setSkill(
                    detected.skill()
            );

            jobSkill.setImportance(
                    detected.importance()
            );

            jobSkill.setWeight(
                    normalizedWeight
            );

            jobSkillRepository.save(
                    jobSkill
            );
        }

        return detectedSkills.size();
    }

    /*
     * ---------------------------------------------------------
     * SKILL DETECTION
     * ---------------------------------------------------------
     */

    private boolean containsSkill(
            String text,
            String skillName) {

        String lowerText =
                text.toLowerCase(Locale.ROOT);

        String lowerSkill =
                skillName.toLowerCase(Locale.ROOT)
                        .trim();

        /*
         * -----------------------------------------------------
         * SINGLE LETTER SKILLS
         * -----------------------------------------------------
         *
         * Special handling for C.
         *
         * We cannot use:
         *
         * text.contains("c")
         *
         * because almost every sentence contains C.
         */

        if (lowerSkill.length() == 1) {

            String regex =
                    "(^|\\W)"
                    + Pattern.quote(lowerSkill)
                    + "($|\\W)";

            return Pattern
                    .compile(regex)
                    .matcher(lowerText)
                    .find();
        }

        /*
         * -----------------------------------------------------
         * NORMALIZE COMMON CHARACTERS
         * -----------------------------------------------------
         */

        String normalizedText =
                lowerText
                        .replace(".", "")
                        .replace("-", " ")
                        .replace("/", " ");

        String normalizedSkill =
                lowerSkill
                        .replace(".", "")
                        .replace("-", " ")
                        .replace("/", " ");

        /*
         * -----------------------------------------------------
         * WORD BOUNDARY MATCH
         * -----------------------------------------------------
         *
         * This prevents:
         *
         * SQL
         *
         * from matching:
         *
         * MySQL
         *
         * and prevents:
         *
         * Java
         *
         * from matching:
         *
         * JavaScript
         */

        String regex =
                "(^|\\W)"
                + Pattern.quote(normalizedSkill)
                + "($|\\W)";

        boolean directMatch =
                Pattern
                        .compile(regex)
                        .matcher(normalizedText)
                        .find();

        if (directMatch) {
            return true;
        }

        /*
         * -----------------------------------------------------
         * COMMON VARIATIONS
         * -----------------------------------------------------
         */

        String variation =
                normalizedSkill;

        if (variation.equals("html/css")) {
            variation = "html css";
        }

        if (variation.equals("git/github")) {
            variation = "git github";
        }

        String variationRegex =
                "(^|\\W)"
                + Pattern.quote(variation)
                + "($|\\W)";

        return Pattern
                .compile(variationRegex)
                .matcher(normalizedText)
                .find();
    }

    /*
     * ---------------------------------------------------------
     * IMPORTANCE DETECTION
     * ---------------------------------------------------------
     */

    private JobSkill.Importance determineImportance(
            String title,
            String description,
            String skillName) {

        String lowerTitle =
                title.toLowerCase(Locale.ROOT);

        String lowerDescription =
                description.toLowerCase(Locale.ROOT);

        /*
         * If skill appears in the job title,
         * treat it as REQUIRED.
         */

        if (containsSkill(
                lowerTitle,
                skillName
        )) {

            return JobSkill.Importance.REQUIRED;
        }

        /*
         * Phrases which usually indicate
         * mandatory requirements.
         */

        String[] requiredIndicators = {

                "required",

                "must have",

                "must-have",

                "mandatory",

                "should have",

                "essential",

                "hands-on experience",

                "experience in",

                "experience with",

                "strong knowledge",

                "proficient in",

                "expertise in",

                "key requirements",

                "requirements",

                "required skills"
        };

        /*
         * Check whether the skill occurs near
         * one of the required indicators.
         */

        for (String indicator :
                requiredIndicators) {

            int indicatorPosition =
                    lowerDescription.indexOf(
                            indicator
                    );

            if (indicatorPosition == -1) {
                continue;
            }

            int start =
                    Math.max(
                            0,
                            indicatorPosition - 150
                    );

            int end =
                    Math.min(
                            lowerDescription.length(),
                            indicatorPosition + 300
                    );

            String section =
                    lowerDescription.substring(
                            start,
                            end
                    );

            if (containsSkill(
                    section,
                    skillName
            )) {

                return JobSkill.Importance.REQUIRED;
            }
        }

        /*
         * Anything explicitly mentioned but not
         * identified as mandatory is PREFERRED.
         */

        return JobSkill.Importance.PREFERRED;
    }

    /*
     * ---------------------------------------------------------
     * INTERNAL RECORD
     * ---------------------------------------------------------
     */

    private record DetectedSkill(
            Skill skill,
            JobSkill.Importance importance
    ) {
    }
}