package com.agilemunk.repository;

import com.agilemunk.entity.Board;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class BoardRepository {

    @PersistenceContext(unitName = "agilemunkPU")
    private EntityManager entityManager;

    @Transactional
    public Board save(Board board) {
        if (board.getId() == null) {
            entityManager.persist(board);
            return board;
        } else {
            return entityManager.merge(board);
        }
    }

    public Optional<Board> findById(Long id) {
        Board board = entityManager.find(Board.class, id);
        return Optional.ofNullable(board);
    }

    public List<Board> findAll() {
        return entityManager.createNamedQuery("Board.findAll", Board.class)
                .getResultList();
    }

    @Transactional
    public void delete(Long id) {
        findById(id).ifPresent(board -> entityManager.remove(board));
    }

    @Transactional
    public Optional<Board> update(Long id, Board updatedBoard) {
        return findById(id).map(board -> {
            board.setName(updatedBoard.getName());
            board.setDescription(updatedBoard.getDescription());
            return entityManager.merge(board);
        });
    }

    public long count() {
        return entityManager.createQuery("SELECT COUNT(b) FROM Board b", Long.class)
                .getSingleResult();
    }
}
