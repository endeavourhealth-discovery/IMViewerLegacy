package org.endeavourhealth.imviewer.common.dal;

import org.endeavourhealth.imviewer.common.models.*;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;


public class ViewerJDBCDAL {
    public List<RelatedConcept> getDefinition(String iri) throws SQLException {
        Connection conn = ConnectionPool.getInstance().pop();


        String sql = "SELECT p.iri AS r_iri, p.name AS r_name, v.iri AS c_iri, v.name AS c_name\n" +
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
        } finally {
            ConnectionPool.getInstance().push(conn);
        }
    }

    public List<RelatedConcept> getSources(String iri, List<String> relationships, int limit, int page) throws SQLException {
        Connection conn = ConnectionPool.getInstance().pop();

        String sql = "SELECT p.iri AS r_iri, p.name AS r_name, c.iri AS c_iri, c.name AS c_name\n" +
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

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            int i = 1;
            stmt.setString(i++, iri);

            if (relationships != null)
                for(String relationship: relationships)
                    stmt.setString(i++, relationship);

            if (limit > 0) {
                if (page == 0) {
                    stmt.setInt(i++, limit);
                } else {
                    stmt.setInt(i++, (page - 1) * limit);
                    stmt.setInt(i++, limit);
                }
            }

            try(ResultSet rs = stmt.executeQuery()) {
                return Hydrator.createRelatedConceptList(rs);
            }
        } finally {
            ConnectionPool.getInstance().push(conn);
        }
    }

    public Concept getConcept(String iri) throws SQLException {
        Connection conn = ConnectionPool.getInstance().pop();

        String sql = "SELECT iri, name, description FROM concept WHERE iri = ?";

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, iri);
            try (ResultSet rs = stmt.executeQuery()) {
                if (!rs.next())
                    return null;
                else
                    return Hydrator.createConcept(rs);
            }

        } finally {
            ConnectionPool.getInstance().push(conn);
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

        Connection conn = ConnectionPool.getInstance().pop();

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
        } finally {
            ConnectionPool.getInstance().push(conn);
        }
    }

    public List<RelatedConcept> getTree(String iri, String root, List<String> relationships) throws SQLException {
        List<RelatedConcept> result = new ArrayList<>();

        String sql = "SELECT p.iri AS r_iri, p.name AS r_name, t.iri AS c_iri, t.name AS c_name\n" +
            "FROM concept c\n" +
            "JOIN concept_tct tct ON tct.source = c.id\n" +
            "JOIN concept p ON p.id = tct.property\n" +
            "JOIN concept t ON t.id = tct.target\n" +
            "WHERE c.iri = ?\n";

        if (relationships != null && !relationships.isEmpty())
            sql += "AND p.iri IN (" + DALHelper.inListParams(relationships.size()) + ")\n";

        sql += "ORDER by tct.level";

        Connection conn = ConnectionPool.getInstance().pop();
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
        } finally {
            ConnectionPool.getInstance().push(conn);
        }

        return result;
    }

    public List<Property> getProperties(String iri) throws SQLException {
        Connection conn = ConnectionPool.getInstance().pop();

        String sql = "SELECT p.iri AS p_iri, p.name AS p_name,\n" +
            "d.min_cardinality, d.max_cardinality,\n" +
            "v.iri as v_iri, v.name AS v_name\n" +
            "FROM concept c\n" +
            "JOIN concept_data_model d ON d.id = c.id\n" +
            "JOIN concept p ON p.id = d.attribute\n" +
            "JOIN concept v ON v.id = d.value_type\n" +
/*
            "JOIN concept tp ON tp.iri = 'sn:SN_116680003'\n" +
            "JOIN concept tt ON tt.iri IN ('rm:isDMObjectProperty', 'rm:isDMDataProperty')\n" +
            "JOIN concept_tct t ON t.source = p.id AND t.property = tp.id AND t.target = tt.id\n" +
*/
            "WHERE c.iri = ?\n";

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, iri);

            try(ResultSet rs = stmt.executeQuery()) {
                return Hydrator.createPropertyList(rs);
            }
        } finally {
            ConnectionPool.getInstance().push(conn);
        }
    }
}
