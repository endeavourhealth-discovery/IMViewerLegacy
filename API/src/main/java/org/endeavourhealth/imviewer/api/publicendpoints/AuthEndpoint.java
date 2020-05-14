package org.endeavourhealth.imviewer.api.publicendpoints;

import org.endeavourhealth.common.utility.MetricsHelper;
import org.endeavourhealth.common.utility.MetricsTimer;
import org.endeavourhealth.imviewer.common.dal.ViewerJDBCDAL;
import org.endeavourhealth.imviewer.common.models.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.util.List;

@Path("/")
public class AuthEndpoint {
    private static final Logger LOG = LoggerFactory.getLogger(AuthEndpoint.class);

    @POST
    @Path("/Authenticate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response authenticate(@Context SecurityContext sc,
                                 UserCredentials userCredentials) throws Exception {
        try (MetricsTimer t = MetricsHelper.recordTime("Viewer.authenticate")) {
            LOG.debug("authenticate");

            UserDetails result = new ViewerJDBCDAL().authenticate(userCredentials.getUsername(), userCredentials.getPassword());

            if (result != null)
                return Response
                .ok()
                .entity(result)
                .build();
            else
                return Response
                    .status(Response.Status.UNAUTHORIZED)
                    .build();
        }
    }

    @POST
    @Path("/Register")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response register(@Context SecurityContext sc,
                                 UserRegistration userRegistration) throws Exception {
        try (MetricsTimer t = MetricsHelper.recordTime("Viewer.register")) {
            LOG.debug("register");

            UserDetails result = new ViewerJDBCDAL().register(userRegistration);

            if (result != null)
                return Response
                    .ok()
                    .entity(result)
                    .build();
            else
                return Response
                    .status(Response.Status.UNAUTHORIZED)
                    .build();
        }
    }
}
