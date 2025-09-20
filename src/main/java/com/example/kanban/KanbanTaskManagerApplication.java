package com.example.kanban;

import com.example.kanban.config.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(JwtProperties.class)
public class KanbanTaskManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(KanbanTaskManagerApplication.class, args);
    }
}
