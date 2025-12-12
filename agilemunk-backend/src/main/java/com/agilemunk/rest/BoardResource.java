package com.agilemunk.rest;

import com.agilemunk.dto.BoardDTO;
import com.agilemunk.entity.Board;
import com.agilemunk.service.BoardService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.stream.Collectors;

@Path("/boards")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BoardResource {

    @Inject
    private BoardService boardService;

    @GET
    public Response getAllBoards() {
        List<BoardDTO> boards = boardService.getAllBoards().stream()
                .map(BoardDTO::new)
                .collect(Collectors.toList());
        return Response.ok(boards).build();
    }

    @GET
    @Path("/{id}")
    public Response getBoardById(@PathParam("id") Long id) {
        return boardService.getBoardById(id)
                .map(board -> Response.ok(new BoardDTO(board)).build())
                .orElse(Response.status(Response.Status.NOT_FOUND)
                        .entity(new ErrorResponse("Board not found with id: " + id))
                        .build());
    }

    @POST
    public Response createBoard(@Valid BoardDTO boardDTO) {
        Board board = boardDTO.toEntity();
        Board created = boardService.createBoard(board);
        return Response.status(Response.Status.CREATED)
                .entity(new BoardDTO(created))
                .build();
    }

    @PUT
    @Path("/{id}")
    public Response updateBoard(@PathParam("id") Long id, @Valid BoardDTO boardDTO) {
        Board board = boardDTO.toEntity();
        return boardService.updateBoard(id, board)
                .map(updated -> Response.ok(new BoardDTO(updated)).build())
                .orElse(Response.status(Response.Status.NOT_FOUND)
                        .entity(new ErrorResponse("Board not found with id: " + id))
                        .build());
    }

    @DELETE
    @Path("/{id}")
    public Response deleteBoard(@PathParam("id") Long id) {
        boolean deleted = boardService.deleteBoard(id);
        if (deleted) {
            return Response.noContent().build();
        } else {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Board not found with id: " + id))
                    .build();
        }
    }

    @GET
    @Path("/count")
    public Response getBoardCount() {
        long count = boardService.getBoardCount();
        return Response.ok(new CountResponse(count)).build();
    }

    // Inner classes for responses
    public static class ErrorResponse {
        private String message;

        public ErrorResponse() {
        }

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    public static class CountResponse {
        private long count;

        public CountResponse() {
        }

        public CountResponse(long count) {
            this.count = count;
        }

        public long getCount() {
            return count;
        }

        public void setCount(long count) {
            this.count = count;
        }
    }
}
