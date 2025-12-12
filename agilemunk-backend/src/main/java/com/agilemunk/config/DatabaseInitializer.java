package com.agilemunk.config;

import com.agilemunk.entity.Board;
import com.agilemunk.entity.Task;
import com.agilemunk.entity.TaskPriority;
import com.agilemunk.entity.TaskStatus;
import com.agilemunk.repository.BoardRepository;
import jakarta.inject.Inject;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

@WebListener
public class DatabaseInitializer implements ServletContextListener {

    @Inject
    private BoardRepository boardRepository;

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("Initializing AgileMunk application...");

        try {
            // Check if database is already initialized
            if (boardRepository != null && boardRepository.count() == 0) {
                initializeSampleData();
            }
        } catch (Exception e) {
            System.err.println("Error during database initialization: " + e.getMessage());
            // Don't throw exception, let the application start even if initialization fails
        }

        System.out.println("AgileMunk application initialized successfully!");
    }

    private void initializeSampleData() {
        System.out.println("No existing data found. Creating sample data...");

        // Create sample board
        Board sampleBoard = new Board("Sample Project", "This is a sample board to get you started with AgileMunk");
        sampleBoard = boardRepository.save(sampleBoard);

        // Create sample tasks
        Task task1 = new Task(
            "Setup development environment",
            "Install all necessary tools and dependencies for the project",
            TaskStatus.DONE,
            TaskPriority.HIGH
        );
        sampleBoard.addTask(task1);

        Task task2 = new Task(
            "Design database schema",
            "Create the database schema and entity relationships",
            TaskStatus.DONE,
            TaskPriority.HIGH
        );
        sampleBoard.addTask(task2);

        Task task3 = new Task(
            "Implement REST API",
            "Develop RESTful API endpoints for board and task management",
            TaskStatus.IN_PROGRESS,
            TaskPriority.HIGH
        );
        sampleBoard.addTask(task3);

        Task task4 = new Task(
            "Create frontend UI",
            "Build a modern and responsive user interface",
            TaskStatus.IN_PROGRESS,
            TaskPriority.MEDIUM
        );
        sampleBoard.addTask(task4);

        Task task5 = new Task(
            "Write unit tests",
            "Develop comprehensive unit tests for all components",
            TaskStatus.TODO,
            TaskPriority.MEDIUM
        );
        sampleBoard.addTask(task5);

        Task task6 = new Task(
            "Deploy to production",
            "Deploy the application to production environment",
            TaskStatus.TODO,
            TaskPriority.LOW
        );
        sampleBoard.addTask(task6);

        boardRepository.save(sampleBoard);

        System.out.println("Sample data created successfully!");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("AgileMunk application shutting down...");
    }
}
