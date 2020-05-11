package org.endeavourhealth.imviewer.common.dal;

import org.endeavourhealth.imviewer.common.models.*;
import sun.misc.BASE64Decoder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


public class ViewerJDBCDAL {
    public List<RelatedConcept> getDefinition(String iri) throws SQLException {
        Connection conn = ConnectionPool.getInstance().pop();


        String sql = "SELECT p.iri AS r_iri, p.name AS r_name, v.iri AS c_iri, v.name AS c_name\n" +
            "FROM concept_property_object o\n" +
            "JOIN concept c ON c.id = o.id AND c.iri = ?\n" +
            "JOIN concept p ON p.id = o.property\n" +
            "JOIN concept v ON v.id = o.value\n" +
            "WHERE NOT EXISTS (\n" +
            "\tSELECT 1 \n" +
            "    FROM concept_tct tct \n" +
            "    JOIN concept tt ON tt.iri IN ('rm:isDMObjectProperty', 'rm:isDMDataProperty')\n" +
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

    public List<RelatedConcept> getSources(String iri, List<String> relationships) throws SQLException {
        Connection conn = ConnectionPool.getInstance().pop();

        String sql = "SELECT p.iri AS r_iri, p.name AS r_name, c.iri AS c_iri, c.name AS c_name\n" +
            "FROM concept_property_object o\n" +
            "JOIN concept v ON v.id = o.value AND v.iri = ?\n" +
            "JOIN concept p ON p.id = o.property\n" +
            "JOIN concept c ON c.id = o.id\n";

        if (relationships != null && !relationships.isEmpty())
            sql += "WHERE p.iri IN (" + DALHelper.inListParams(relationships.size()) + ")";

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            int i = 1;
            stmt.setString(i++, iri);

            if (relationships != null)
                for(String relationship: relationships)
                    stmt.setString(i++, relationship);

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
            "v.iri as v_iri, v.name AS v_name,\n" +
            "d.property_level,\n" +
            "o.iri AS o_iri, o.name AS o_name\n" +
            "FROM concept c\n" +
            "JOIN concept_data_model d ON d.id = c.id\n" +
            "JOIN concept p ON p.id = d.property\n" +
            "JOIN concept v ON v.id = d.value_type\n" +
            "JOIN concept o ON o.id = d.property_owner\n" +
/*
            "JOIN concept tp ON tp.iri = 'sn:SN_116680003'\n" +
            "JOIN concept tt ON tt.iri IN ('rm:isDMObjectProperty', 'rm:isDMDataProperty')\n" +
            "JOIN concept_tct t ON t.source = p.id AND t.property = tp.id AND t.target = tt.id\n" +
*/
            "WHERE c.iri = ?\n" +
            "ORDER BY d.property_level DESC\n";

        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, iri);

            try(ResultSet rs = stmt.executeQuery()) {
                return Hydrator.createPropertyList(rs);
            }
        } finally {
            ConnectionPool.getInstance().push(conn);
        }
    }

    public UserDetails authenticate(String username, String password) throws SQLException, NoSuchAlgorithmException {
        UserDetails result = new UserDetails()
            .setUsername(username);

        String token = UUID.randomUUID().toString();

        Connection conn = ConnectionPool.getInstance().pop();
        try {
            try (PreparedStatement stmt = conn.prepareStatement("SELECT first_name, last_name FROM users WHERE username = ? AND password = ?")) {
                stmt.setString(1, username);
                stmt.setString(2, passwordHash(password));
                try (ResultSet rs = stmt.executeQuery()) {
                    if (!rs.next())
                        return result.setMessage("Incorrect username/password");

                    result.setFirstName(rs.getString("first_name"))
                        .setLastName(rs.getString("last_name"));
                }
            }

            try (PreparedStatement stmt = conn.prepareStatement("UPDATE users SET token = ? WHERE username = ? AND password = ?")) {
                stmt.setString(1, token);
                stmt.setString(2, username);
                stmt.setString(3, passwordHash(password));

                if (stmt.executeUpdate() != 1)
                    return result.setMessage("Unable to generate token");
            }

            return result.setToken(token);
        } finally {
            ConnectionPool.getInstance().push(conn);
        }
    }

    public UserDetails register(UserRegistration userRegistration) throws SQLException, NoSuchAlgorithmException {
        Connection conn = ConnectionPool.getInstance().pop();
        try {
            try (PreparedStatement stmt = conn.prepareStatement("INSERT INTO users (username, first_name, last_name, password) VALUES (?, ?, ?, ?)")) {
                stmt.setString(1, userRegistration.getUsername());
                stmt.setString(2, userRegistration.getFirstName());
                stmt.setString(3, userRegistration.getLastName());
                stmt.setString(4, passwordHash(userRegistration.getPassword()));
                try {
                    stmt.executeUpdate();
                    return authenticate(userRegistration.getUsername(), userRegistration.getPassword());
                } catch (SQLIntegrityConstraintViolationException e) {
                    return userRegistration.setMessage("User name already exists");
                } catch (Exception e) {
                    return userRegistration.setMessage(e.toString());
                }
            }
        } finally {
            ConnectionPool.getInstance().push(conn);
        }
    }

    public boolean validate(String authString) throws SQLException {
        if (authString == null)
            return false;

        try {
            String decodedAuth = "";
            // Header is in the format "Basic 5tyc0uiDat4"
            // We need to extract data before decoding it back to original string
            String[] authParts = authString.split("\\s+");
            String authInfo = authParts[1];
            // Decode the data back to original string
            byte[] bytes = null;
            try {
                bytes = new BASE64Decoder().decodeBuffer(authInfo);
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            decodedAuth = new String(bytes);
            authParts = decodedAuth.split(":");

            String username = authParts[0];
            String token = authParts[1];

            Connection conn = ConnectionPool.getInstance().pop();
            try {
                try (PreparedStatement stmt = conn.prepareStatement("SELECT 1 FROM users WHERE username = ? AND token = ?")) {
                    stmt.setString(1, username);
                    stmt.setString(2, token);
                    try (ResultSet rs = stmt.executeQuery()) {
                        return rs.next();
                    }
                }
            } finally {
                ConnectionPool.getInstance().push(conn);
            }
        } catch (Exception e) {
            return false;
        }
    }

    private String passwordHash(String password) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");

        byte[] hash = digest.digest(
            password.getBytes(StandardCharsets.UTF_8));
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
