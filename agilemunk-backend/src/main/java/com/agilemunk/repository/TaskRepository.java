package com.agilemunk.repository;

import com.agilemunk.entity.Task;
import com.agilemunk.entity.TaskStatus;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class TaskRepository {

    @PersistenceContext(unitName = "agilemunkPU")
    private EntityManager entityManager;

    @Transactional
    public Task save(Task task) {
        if (task.getId() == null) {
            entityManager.persist(task);
            return task;
        } else {
            return entityManager.merge(task);
        }
    }

    public Optional<Task> findById(Long id) {
        Task task = entityManager.find(Task.class, id);
        return Optional.ofNullable(task);
    }

    public List<Task> findAll() {
        return entityManager.createNamedQuery("Task.findAll", Task.class)
                .getResultList();
    }

    public List<Task> findByBoard(Long boardId) {
        return entityManager.createNamedQuery("Task.findByBoard", Task.class)
                .setParameter("boardId", boardId)
                .getResultList();
    }

    @Transactional
    public void delete(Long id) {
        findById(id).ifPresent(task -> entityManager.remove(task));
    }

    @Transactional
    public Optional<Task> update(Long id, Task updatedTask) {
        return findById(id).map(task -> {
            task.setTitle(updatedTask.getTitle());
            task.setDescription(updatedTask.getDescription());
            task.setStatus(updatedTask.getStatus());
            task.setPriority(updatedTask.getPriority());
            return entityManager.merge(task);
        });
    }

    public long count() {
        return entityManager.createQuery("SELECT COUNT(t) FROM Task t", Long.class)
                .getSingleResult();
    }

    public long countByStatus(TaskStatus status) {
        return entityManager.createQuery("SELECT COUNT(t) FROM Task t WHERE t.status = :status", Long.class)
                .setParameter("status", status)
                .getSingleResult();
    }

    public long countByBoard(Long boardId) {
        return entityManager.createQuery("SELECT COUNT(t) FROM Task t WHERE t.board.id = :boardId", Long.class)
                .setParameter("boardId", boardId)
                .getSingleResult();
    }
}
