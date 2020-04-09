package org.endeavourhealth.imviewer.api.publicendpoints;

import org.endeavourhealth.common.utility.MetricsHelper;
import org.endeavourhealth.common.utility.MetricsTimer;
import org.endeavourhealth.imviewer.common.dal.ViewerJDBCDAL;
import org.endeavourhealth.imviewer.common.models.Concept;
import org.endeavourhealth.imviewer.common.models.Property;
import org.endeavourhealth.imviewer.common.models.RelatedConcept;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.util.List;

@Path("/Viewer")
public class ViewerEndpoint {
    private static final Logger LOG = LoggerFactory.getLogger(ViewerEndpoint.class);

    @GET
    @Path("/Search")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response search(@Context SecurityContext sc,
                           @QueryParam("root") String root,
                           @QueryParam("term") String term,
                           @QueryParam("relationship") List<String> relationships) throws Exception {
        try (MetricsTimer t = MetricsHelper.recordTime("Viewer.search")) {
            LOG.debug("search");

            List<Concept> result = new ViewerJDBCDAL().search(term, root, relationships);

            return Response
                .ok()
                .entity(result)
                .build();
        }
    }

    @GET
    @Path("/{iri}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getConcept(@Context SecurityContext sc,
                               @PathParam("iri") String iri) throws Exception {
        try (MetricsTimer t = MetricsHelper.recordTime("Viewer.getConcept")) {
            LOG.debug("getConcept");

            Concept result = new ViewerJDBCDAL().getConcept(iri);

            return Response
                .ok()
                .entity(result)
                .build();
        }
    }

    @GET
    @Path("/{iri}/Tree")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTree(@Context SecurityContext sc,
                               @PathParam("iri") String iri,
                               @QueryParam("root") String root,
                               @QueryParam("relationship") List<String> relationships) throws Exception {
        try (MetricsTimer t = MetricsHelper.recordTime("Viewer.getTargets")) {
            LOG.debug("getTargets");

            List<RelatedConcept> result = new ViewerJDBCDAL().getTree(iri, root, relationships);

            return Response
                .ok()
                .entity(result)
                .build();
        }
    }

    @GET
    @Path("/{iri}/Properties")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProperties(@Context SecurityContext sc,
                               @PathParam("iri") String iri) throws Exception {
        try (MetricsTimer t = MetricsHelper.recordTime("Viewer.getProperties")) {
            LOG.debug("getProperties");

            List<Property> result = new ViewerJDBCDAL().getProperties(iri);

            return Response
                .ok()
                .entity(result)
                .build();
        }
    }

    @GET
    @Path("/{iri}/Definition")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getDefinition(@Context SecurityContext sc,
                               @PathParam("iri") String iri) throws Exception {
        try (MetricsTimer t = MetricsHelper.recordTime("Viewer.getDefinition")) {
            LOG.debug("getDefinition");

            List<RelatedConcept> result = new ViewerJDBCDAL().getDefinition(iri);

            return Response
                .ok()
                .entity(result)
                .build();
        }
    }

    @GET
    @Path("/{iri}/Sources")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSources(@Context SecurityContext sc,
                               @PathParam("iri") String iri,
                               @QueryParam("relationship") List<String> relationships) throws Exception {
        try (MetricsTimer t = MetricsHelper.recordTime("Viewer.getSources")) {
            LOG.debug("getSources");

            List<RelatedConcept> result = new ViewerJDBCDAL().getSources(iri, relationships);

            return Response
                .ok()
                .entity(result)
                .build();
        }
    }
}
