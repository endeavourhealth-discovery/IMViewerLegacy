package org.endeavourhealth.imviewer.common.dal;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import org.endeavourhealth.common.cache.ObjectMapperPool;
import org.endeavourhealth.imviewer.common.models.*;

import java.io.IOException;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ViewerJDBCDAL extends BaseJDBCDAL {
    public List<RelatedConcept> getDefinition(String iri) throws SQLException {
        String sql = "SELECT o.minCardinality, o.maxCardinality,\n" +
            "p.iri AS r_iri, p.name AS r_name,\n" +
            "v.iri AS c_iri, v.name AS c_name\n" +
            "FROM concept_property_object o\n" +
            "JOIN concept c ON c.id = o.concept AND c.iri = ?\n" +
            "JOIN concept p ON p.id = o.property\n" +
            "JOIN concept v ON v.id = o.object\n" +
            "WHERE NOT EXISTS (\n" +
            "\tSELECT 1 \n" +
            "    FROM concept_tct tct \n" +
            "    JOIN concept tt ON tt.iri IN (':DM_ObjectProperty', ':DM_DataProperty')\n" +
            "    WHERE tct.source = p.id AND tct.target = tt.id\n" +
            ");\n";

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, iri);

             try(ResultSet rs = stmt.executeQuery()) {
                 return Hydrator.createRelatedConceptList(rs);
             }
        }
    }

    public PagedResultSet<RelatedConcept> getSources(String iri, List<String> relationships, int limit, int page) throws SQLException {
        String sql = "SELECT SQL_CALC_FOUND_ROWS\n" +
            "o.minCardinality, o.maxCardinality,\n" +
            "p.iri AS r_iri, p.name AS r_name,\n" +
            "c.iri AS c_iri, c.name AS c_name\n" +
            "FROM concept_property_object o\n" +
            "JOIN concept v ON v.id = o.object AND v.iri = ?\n" +
            "JOIN concept p ON p.id = o.property\n" +
            "JOIN concept c ON c.id = o.concept\n";

        if (relationships != null && !relationships.isEmpty())
            sql += "WHERE p.iri IN (" + DALHelper.inListParams(relationships.size()) + ")\n";

        if (limit > 0) {
            sql += "LIMIT ?";
            if (page > 0) {
                sql += ",?";
            }
        }

        PagedResultSet<RelatedConcept> result = new PagedResultSet<RelatedConcept>()
            .setPage(page)
            .setPageSize(limit);

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            int i = 1;
            stmt.setString(i++, iri);

            if (relationships != null)
                for (String relationship : relationships)
                    stmt.setString(i++, relationship);

            if (limit > 0) {
                if (page == 0) {
                    stmt.setInt(i++, limit);
                } else {
                    stmt.setInt(i++, (page - 1) * limit);
                    stmt.setInt(i++, limit);
                }
            }

            try (ResultSet rs = stmt.executeQuery()) {
                result.setResult(Hydrator.createRelatedConceptList(rs));
            }
        }

        result.setTotalRecords(DALHelper.getCalculatedRows(conn));

        return result;
    }

    public PagedResultSet<RelatedConcept> getTargets(String iri, List<String> relationships, int limit, int page) throws SQLException {
        String sql = "SELECT SQL_CALC_FOUND_ROWS\n" +
            "o.minCardinality, o.maxCardinality,\n" +
            "p.iri AS r_iri, p.name AS r_name,\n" +
            "v.iri AS c_iri, v.name AS c_name\n" +
            "FROM concept_property_object o\n" +
            "JOIN concept c ON c.id = o.concept AND c.iri = ?\n" +
            "JOIN concept p ON p.id = o.property\n" +
            "JOIN concept v ON v.id = o.object\n";

        if (relationships != null && !relationships.isEmpty())
            sql += "WHERE p.iri IN (" + DALHelper.inListParams(relationships.size()) + ")\n";

        if (limit > 0) {
            sql += "LIMIT ?";
            if (page > 0) {
                sql += ",?";
            }
        }

        PagedResultSet<RelatedConcept> result = new PagedResultSet<RelatedConcept>()
            .setPage(page)
            .setPageSize(limit);

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            int i = 1;
            stmt.setString(i++, iri);

            if (relationships != null)
                for (String relationship : relationships)
                    stmt.setString(i++, relationship);

            if (limit > 0) {
                if (page == 0) {
                    stmt.setInt(i++, limit);
                } else {
                    stmt.setInt(i++, (page - 1) * limit);
                    stmt.setInt(i++, limit);
                }
            }

            try (ResultSet rs = stmt.executeQuery()) {
                result.setResult(Hydrator.createRelatedConceptList(rs));
            }
        }

        result.setTotalRecords(DALHelper.getCalculatedRows(conn));

        return result;
    }

    public Concept getConcept(String iri) throws SQLException {

        String sql = "SELECT iri, name, description FROM concept WHERE iri = ?";

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, iri);
            try (ResultSet rs = stmt.executeQuery()) {
                if (!rs.next())
                    return null;
                else
                    return Hydrator.createConcept(rs);
            }
        }
    }

    public List<Concept> search(String term, String root, List<String> relationships) throws SQLException {
        String sql = "SELECT c.iri, c.name, c.description\n" +
            "FROM concept c\n" +
            "JOIN concept_tct tct ON tct.source = c.id\n" +
            "JOIN concept p ON p.id = tct.property\n" +
            "JOIN concept t ON t.id = tct.target\n" +
            "WHERE c.name LIKE ?\n" +
            "AND t.iri = ?\n";

        if (relationships != null && !relationships.isEmpty())
            sql += "AND p.iri IN (" + DALHelper.inListParams(relationships.size()) + ")\n";

        sql += "ORDER BY LENGTH(c.name)\n" +
            "LIMIT 10";

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            int i = 1;
            stmt.setString(i++, '%' + term + '%');
            stmt.setString(i++, root);

            if (relationships != null)
                for(String relationship: relationships)
                    stmt.setString(i++, relationship);

            try (ResultSet rs = stmt.executeQuery()) {
                return Hydrator.createConceptList(rs);
            }
        }
    }

    public List<RelatedConcept> getTree(String iri, String root, List<String> relationships) throws SQLException {
        List<RelatedConcept> result = new ArrayList<>();

        String sql = "SELECT null AS minCardinality, null AS maxCardinality,\n" +
            "p.iri AS r_iri, p.name AS r_name,\n" +
            "t.iri AS c_iri, t.name AS c_name\n" +
            "FROM concept c\n" +
            "JOIN concept_tct tct ON tct.source = c.id\n" +
            "JOIN concept p ON p.id = tct.property\n" +
            "JOIN concept t ON t.id = tct.target\n" +
            "WHERE c.iri = ?\n";

        if (relationships != null && !relationships.isEmpty())
            sql += "AND p.iri IN (" + DALHelper.inListParams(relationships.size()) + ")\n";

        sql += "ORDER by tct.level";

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            int i = 1;
            stmt.setString(i++, iri);

            if (relationships != null)
                for(String relationship: relationships)
                    stmt.setString(i++, relationship);

            try(ResultSet rs = stmt.executeQuery()) {
                boolean rootFound = false;
                while (rs.next() && !rootFound) {
                    result.add(Hydrator.createRelatedConcept(rs));
                    rootFound = rs.getString("c_iri").equals(root);
                }
            }
        }

        return result;
    }

    public List<Property> getProperties(String iri, boolean inherited) throws SQLException {
        String sql = "SELECT p.iri AS p_iri, p.name AS p_name,\n" +
            "d.min_cardinality, d.max_cardinality,\n" +
            "v.iri as v_iri, v.name AS v_name,\n" +
            "-1 as level, c.iri as o_iri, c.name AS o_name\n" +
            "FROM concept c\n" +
            "JOIN concept_data_model d ON d.id = c.id\n" +
            "JOIN concept p ON p.id = d.attribute\n" +
            "JOIN concept v ON v.id = d.value_type\n" +
            "WHERE c.iri = ?\n";

        if (inherited)
            sql += "UNION SELECT p.iri AS p_iri, p.name AS p_name,\n" +
            "d.min_cardinality, d.max_cardinality,\n" +
            "v.iri as v_iri, v.name AS v_name,\n" +
            "tct.level, o.iri as o_iri, o.name AS o_name\n" +
            "FROM concept c\n" +
            "JOIN concept_tct tct ON tct.source = c.id\n" +
            "JOIN concept tp ON tp.id = tct.property AND tp.iri = ':SN_116680003'\n" +
            "JOIN concept o ON o.id = tct.target\n" +
            "JOIN concept_data_model d ON d.id = o.id\n" +
            "JOIN concept p ON p.id = d.attribute\n" +
            "JOIN concept v ON v.id = d.value_type\n" +
            "WHERE c.iri = ?\n";

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, iri);
            if (inherited)
                stmt.setString(2, iri);

            try(ResultSet rs = stmt.executeQuery()) {
                return Hydrator.createPropertyList(rs);
            }
        }
    }

    public List<ValueSetMember> getValueSetMembers(String iri) throws SQLException, IOException {
        List<ValueSetMember> result = new ArrayList<>();

        String sql = "SELECT v.expression\n" +
            "FROM value_set v\n" +
            "JOIN concept c ON c.id = v.concept\n" +
            "WHERE c.iri = ?";

        String expression;

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            DALHelper.setString(stmt, 1, iri);
            try (ResultSet rs = stmt.executeQuery()) {
                if (!rs.next())
                    return result;

                expression = rs.getString("expression");
            }
        }

        ArrayNode members = (ArrayNode)ObjectMapperPool.getInstance().readTree(expression);

        sql = "SELECT iri, name, code, definition FROM concept WHERE iri = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            for( JsonNode node : members) {
                if (node.has("Class")) {
                    stmt.setString(1, node.get("Class").textValue());
                    try (ResultSet rs = stmt.executeQuery()) {
                        if (rs.next()) {
                            result.add(new ValueSetMember()
                                .setIri(rs.getString("iri"))
                                .setName(rs.getString("name"))
                                .setCode(rs.getString("code"))
                                .setDefinition(ObjectMapperPool.getInstance().readTree(rs.getString("definition")))
                            );
                        }
                    }
                }
            }
        }
        return result;
    }

    public List<SchemeCount> getChildCountByScheme(String iri) throws SQLException {
        List<SchemeCount> result = new ArrayList<>();

        String sql = "SELECT scm.iri, scm.name AS scheme, COUNT(DISTINCT(s.id)) AS cnt\n" +
            "FROM concept c\n" +
            "JOIN concept p ON p.iri = ':SN_116680003'\n" +
            "JOIN concept_tct t ON t.target = c.id AND t.property = p.id\n" +
            "JOIN concept s ON s.id = t.source\n" +
            "LEFT JOIN concept scm on scm.id = s.scheme\n" +
            "WHERE c.iri = ?\n" +
            "GROUP BY scm.id";

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            DALHelper.setString(stmt, 1, iri);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    result.add(new SchemeCount()
                        .setIri(rs.getString("iri"))
                        .setName(rs.getString("scheme"))
                        .setCount(rs.getInt("cnt"))
                    );
                }
            }
        }

        return result;
    }

    public List<SchemeChildren> getChildren(String iri, String scheme) throws SQLException {
        List<SchemeChildren> result = new ArrayList<>();

        String sql = "SELECT DISTINCT scm.iri, scm.name AS scheme, s.iri AS childIri, s.name AS childName, s.code AS childCode\n" +
            "FROM concept c\n" +
            "JOIN concept p ON p.iri = ':SN_116680003'\n" +
            "JOIN concept_tct t ON t.target = c.id AND t.property = p.id\n" +
            "JOIN concept s ON s.id = t.source\n" +
            "LEFT JOIN concept scm on scm.id = s.scheme\n" +
            "WHERE c.iri = ?\n";

        if (scheme != null && !scheme.isEmpty())
            sql += "AND scm.iri = ?\n";

        sql += "ORDER BY scm.name, s.name\n";

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            DALHelper.setString(stmt, 1, iri);

            if (scheme != null && !scheme.isEmpty())
                DALHelper.setString(stmt, 2, scheme);

            try (ResultSet rs = stmt.executeQuery()) {
                SchemeChildren sc = null;

                while (rs.next()) {
                    if (sc == null || !rs.getString("iri").equals(sc.getIri())) {
                        sc = new SchemeChildren()
                            .setIri(rs.getString("iri"))
                            .setName(rs.getString("scheme"));
                        result.add(sc);
                    }
                    sc.addChild(new SchemeChild()
                        .setIri(rs.getString("childIri"))
                        .setName(rs.getString("childName"))
                        .setCode(rs.getString("childCode"))
                    );
                }
            }
        }

        return result;    }
}
