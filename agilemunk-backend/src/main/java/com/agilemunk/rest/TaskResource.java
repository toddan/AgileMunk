package com.agilemunk.rest;

import com.agilemunk.dto.TaskDTO;
import com.agilemunk.entity.Task;
import com.agilemunk.entity.TaskStatus;
import com.agilemunk.service.TaskService;
import com.agilemunk.rest.BoardResource.ErrorResponse;
import com.agilemunk.rest.BoardResource.CountResponse;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.stream.Collectors;

@Path("/boards/{boardId}/tasks")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TaskResource {

    @Inject
    private TaskService taskService;

    @GET
    public Response getTasksByBoard(@PathParam("boardId") Long boardId) {
        List<TaskDTO> tasks = taskService.getTasksByBoard(boardId).stream()
                .map(TaskDTO::new)
                .collect(Collectors.toList());
        return Response.ok(tasks).build();
    }

    @POST
    public Response createTask(@PathParam("boardId") Long boardId, @Valid TaskDTO taskDTO) {
        Task task = taskDTO.toEntity();
        return taskService.createTask(boardId, task)
                .map(created -> Response.status(Response.Status.CREATED)
                        .entity(new TaskDTO(created))
                        .build())
                .orElse(Response.status(Response.Status.NOT_FOUND)
                        .entity(new ErrorResponse("Board not found with id: " + boardId))
                        .build());
    }

    @GET
    @Path("/{taskId}")
    public Response getTaskById(@PathParam("taskId") Long taskId) {
        return taskService.getTaskById(taskId)
                .map(task -> Response.ok(new TaskDTO(task)).build())
                .orElse(Response.status(Response.Status.NOT_FOUND)
                        .entity(new ErrorResponse("Task not found with id: " + taskId))
                        .build());
    }

    @PUT
    @Path("/{taskId}")
    public Response updateTask(@PathParam("taskId") Long taskId, @Valid TaskDTO taskDTO) {
        Task task = taskDTO.toEntity();
        return taskService.updateTask(taskId, task)
                .map(updated -> Response.ok(new TaskDTO(updated)).build())
                .orElse(Response.status(Response.Status.NOT_FOUND)
                        .entity(new ErrorResponse("Task not found with id: " + taskId))
                        .build());
    }

    @DELETE
    @Path("/{taskId}")
    public Response deleteTask(@PathParam("taskId") Long taskId) {
        boolean deleted = taskService.deleteTask(taskId);
        if (deleted) {
            return Response.noContent().build();
        } else {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ErrorResponse("Task not found with id: " + taskId))
                    .build();
        }
    }

    @GET
    @Path("/count")
    public Response getTaskCountByBoard(@PathParam("boardId") Long boardId) {
        long count = taskService.getTaskCountByBoard(boardId);
        return Response.ok(new CountResponse(count)).build();
    }
}

@Path("/tasks")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class TaskGlobalResource {

    @Inject
    private TaskService taskService;

    @GET
    public Response getAllTasks() {
        List<TaskDTO> tasks = taskService.getAllTasks().stream()
                .map(TaskDTO::new)
                .collect(Collectors.toList());
        return Response.ok(tasks).build();
    }

    @GET
    @Path("/count")
    public Response getTaskCount() {
        long count = taskService.getTaskCount();
        return Response.ok(new CountResponse(count)).build();
    }

    @GET
    @Path("/count/status/{status}")
    public Response getTaskCountByStatus(@PathParam("status") String statusStr) {
        try {
            TaskStatus status = TaskStatus.valueOf(statusStr.toUpperCase());
            long count = taskService.getTaskCountByStatus(status);
            return Response.ok(new CountResponse(count)).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse("Invalid status: " + statusStr))
                    .build();
        }
    }
}
