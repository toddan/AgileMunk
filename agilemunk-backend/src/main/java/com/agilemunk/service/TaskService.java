package com.agilemunk.service;

import com.agilemunk.entity.Board;
import com.agilemunk.entity.Task;
import com.agilemunk.entity.TaskStatus;
import com.agilemunk.repository.BoardRepository;
import com.agilemunk.repository.TaskRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class TaskService {

    @Inject
    private TaskRepository taskRepository;

    @Inject
    private BoardRepository boardRepository;

    @Transactional
    public Optional<Task> createTask(@NotNull Long boardId, @Valid @NotNull Task task) {
        Optional<Board> board = boardRepository.findById(boardId);
        if (board.isPresent()) {
            task.setBoard(board.get());
            return Optional.of(taskRepository.save(task));
        }
        return Optional.empty();
    }

    public Optional<Task> getTaskById(@NotNull Long id) {
        return taskRepository.findById(id);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksByBoard(@NotNull Long boardId) {
        return taskRepository.findByBoard(boardId);
    }

    @Transactional
    public Optional<Task> updateTask(@NotNull Long id, @Valid @NotNull Task task) {
        return taskRepository.update(id, task);
    }

    @Transactional
    public boolean deleteTask(@NotNull Long id) {
        Optional<Task> task = taskRepository.findById(id);
        if (task.isPresent()) {
            taskRepository.delete(id);
            return true;
        }
        return false;
    }

    public long getTaskCount() {
        return taskRepository.count();
    }

    public long getTaskCountByStatus(TaskStatus status) {
        return taskRepository.countByStatus(status);
    }

    public long getTaskCountByBoard(Long boardId) {
        return taskRepository.countByBoard(boardId);
    }
}
