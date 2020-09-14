package org.endeavourhealth.imviewer.api.endpoints;

import com.fasterxml.jackson.databind.JsonNode;
import org.endeavourhealth.common.utility.MetricsHelper;
import org.endeavourhealth.common.utility.MetricsTimer;
import org.endeavourhealth.imviewer.common.dal.ViewerJDBCDAL;
import org.endeavourhealth.imviewer.common.logic.TextFormat;
import org.endeavourhealth.imviewer.common.models.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.util.List;

@Path("/concepts")
public class ConceptEndpoint {
    private static final Logger LOG = LoggerFactory.getLogger(ConceptEndpoint.class);

    @GET
    @Path("/Search")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response search(@Context SecurityContext sc,
                           @QueryParam("root") String root,
                           @QueryParam("term") String term,
                           @QueryParam("relationship") List<String> relationships) throws Exception {
        try (MetricsTimer t = MetricsHelper.recordTime("Viewer.search");
             ViewerJDBCDAL dal = new ViewerJDBCDAL()) {
            LOG.debug("search");

            List<Concept> result = dal.search(term, root, relationships);

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
        try (MetricsTimer t = MetricsHelper.recordTime("Viewer.getConcept");
             ViewerJDBCDAL dal = new ViewerJDBCDAL()) {
            LOG.debug("getConcept");

            Concept result = dal.getConcept(iri);

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
        try (MetricsTimer t = MetricsHelper.recordTime("Viewer.getTargets");
             ViewerJDBCDAL dal = new ViewerJDBCDAL()) {
            LOG.debug("getTree");

            List<RelatedConcept> result = dal.getTree(iri, root, relationships);

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
                               @PathParam("iri") String iri,
                                  @QueryParam("inherited") Boolean inherited
                                  ) throws Exception {
        try (MetricsTimer t = MetricsHelper.recordTime("Viewer.getProperties");
             ViewerJDBCDAL dal = new ViewerJDBCDAL()) {
            LOG.debug("getProperties");

            List<Property> result = dal.getProperties(iri, (inherited == null) ? false : inherited);

            return Response
                .ok()
                .entity(result)
                .build();
        }
    }

    @GET
    @Path("/{iri}/Textual")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_PLAIN)
    public Response getTextual(@Context SecurityContext sc,
                                  @PathParam("iri") String iri) throws Exception {
        try (MetricsTimer t = MetricsHelper.recordTime("Viewer.getTextual");
             ViewerJDBCDAL dal = new ViewerJDBCDAL()) {
            LOG.debug("getTextual");

            String result = new TextFormat().get(iri);

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
        try (MetricsTimer t = MetricsHelper.recordTime("Viewer.getDefinition");
             ViewerJDBCDAL dal = new ViewerJDBCDAL()) {
            LOG.debug("getDefinition");

            List<JsonNode> result = dal.getAxioms(iri);

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
                               @QueryParam("relationship") List<String> relationships,
                               @QueryParam("limit") Integer limit,
                               @QueryParam("page") Integer page) throws Exception {

        limit = (limit == null) ? 0 : limit;
        page = (page == null) ? 0 : page;

        try (MetricsTimer t = MetricsHelper.recordTime("Viewer.getSources");
             ViewerJDBCDAL dal = new ViewerJDBCDAL()) {
            LOG.debug("getSources");

            PagedResultSet<RelatedConcept> result = dal.getSources(iri, relationships, limit, page);

            return Response
                .ok()
                .entity(result)
                .build();
        }
    }

    @GET
    @Path("/{iri}/Targets")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTargets(@Context SecurityContext sc,
                               @PathParam("iri") String iri,
                               @QueryParam("relationship") List<String> relationships,
                               @QueryParam("limit") Integer limit,
                               @QueryParam("page") Integer page) throws Exception {

        limit = (limit == null) ? 0 : limit;
        page = (page == null) ? 0 : page;

        try (MetricsTimer t = MetricsHelper.recordTime("Viewer.getTargets");
             ViewerJDBCDAL dal = new ViewerJDBCDAL()) {
            LOG.debug("getTargets");

            PagedResultSet<RelatedConcept> result = dal.getTargets(iri, relationships, limit, page);

            return Response
                .ok()
                .entity(result)
                .build();
        }
    }

    @GET
    @Path("/{iri}/members")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMembers(@Context SecurityContext sc,
                               @PathParam("iri") String iri) throws Exception {

        try (MetricsTimer t = MetricsHelper.recordTime("Viewer.getMembers");
             ViewerJDBCDAL dal = new ViewerJDBCDAL()) {
            LOG.debug("getMembers");

            List<ValueSetMember> result = dal.getValueSetMembers(iri);

            return Response
                .ok()
                .entity(result)
                .build();
        }
    }

    @GET
    @Path("/{iri}/childCountByScheme")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getChildCountByScheme(@Context SecurityContext sc,
                               @PathParam("iri") String iri) throws Exception {

        try (MetricsTimer t = MetricsHelper.recordTime("Viewer.getChildCountByScheme");
             ViewerJDBCDAL dal = new ViewerJDBCDAL()) {
            LOG.debug("getChildCountByScheme");

            List<SchemeCount> result = dal.getChildCountByScheme(iri);

            return Response
                .ok()
                .entity(result)
                .build();
        }
    }

    @GET
    @Path("/{iri}/children")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getChildren(@Context SecurityContext sc,
                                          @PathParam("iri") String iri,
                                          @QueryParam("scheme") String scheme) throws Exception {

        try (MetricsTimer t = MetricsHelper.recordTime("Viewer.getChildren");
             ViewerJDBCDAL dal = new ViewerJDBCDAL()) {
            LOG.debug("getChildren");

            List<SchemeChildren> result = dal.getChildren(iri, scheme);

            return Response
                .ok()
                .entity(result)
                .build();
        }
    }
}
