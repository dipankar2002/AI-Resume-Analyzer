package com.resumeanalyzer;

public class TestEnv {

    public static void main(String[] args) {
        String key = System.getenv("GEMINI_API_KEY");

        if (key != null && !key.isBlank()) {
            System.out.println("GEMINI_API_KEY FOUND ✅");
            System.out.println("Key length: " + key.length());
        } else {
            System.out.println("GEMINI_API_KEY NOT FOUND ❌");
        }
    }
}