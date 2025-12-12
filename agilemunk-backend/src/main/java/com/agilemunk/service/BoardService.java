package com.agilemunk.service;

import com.agilemunk.entity.Board;
import com.agilemunk.repository.BoardRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class BoardService {

    @Inject
    private BoardRepository boardRepository;

    @Transactional
    public Board createBoard(@Valid @NotNull Board board) {
        return boardRepository.save(board);
    }

    public Optional<Board> getBoardById(@NotNull Long id) {
        return boardRepository.findById(id);
    }

    public List<Board> getAllBoards() {
        return boardRepository.findAll();
    }

    @Transactional
    public Optional<Board> updateBoard(@NotNull Long id, @Valid @NotNull Board board) {
        return boardRepository.update(id, board);
    }

    @Transactional
    public boolean deleteBoard(@NotNull Long id) {
        Optional<Board> board = boardRepository.findById(id);
        if (board.isPresent()) {
            boardRepository.delete(id);
            return true;
        }
        return false;
    }

    public long getBoardCount() {
        return boardRepository.count();
    }
}
