package com.agilemunk.rest;

import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;

@ApplicationPath("/api")
public class JaxrsApplication extends Application {
    // JAX-RS will automatically discover and register all @Path annotated classes
}
