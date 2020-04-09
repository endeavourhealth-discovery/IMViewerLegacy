package org.endeavourhealth.informationManager;

import org.endeavourhealth.common.config.ConfigManager;
import org.endeavourhealth.imviewer.common.dal.ConnectionPool;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class RuntimeImporter {
    private Connection conn;

    public void execute() throws Exception {
        ConfigManager.Initialize("im-runtime-import");
        conn = ConnectionPool.getInstance().pop();

        try {
            System.out.println("Importing...");
            loadOntologies();
            loadConcepts("./OwlConcepts.txt");
            loadConcepts("./CoreConcepts.txt");
            loadConcepts("./SnomedConcepts.txt");
            loadConceptPropertyObject();
            loadConceptDataModel();
            System.out.println("Cleaning up...");
        } finally {
            ConnectionPool.getInstance().push(conn);
        }
        System.out.println("Finished.");
    }

    private void loadOntologies() throws IOException, SQLException {
        System.out.println("Importing ontologies...");
        try (BufferedReader br = new BufferedReader(new FileReader("./Ontology.txt"))) {
            // header
            br.readLine();
            int i = 1;

            try (PreparedStatement stmt = conn.prepareStatement("REPLACE INTO ontology (prefix, iri) VALUES (?, ?)")) {
                String line;
                while ((line = br.readLine()) != null) {
                    String[] fields = line.split("\t");
                    stmt.setString(1, fields[0]);
                    stmt.setString(2, fields[1]);
                    if (stmt.executeUpdate() == 0)
                        System.err.println("Error upserting ontology row " + (i+1) + " - [" + line + "]");
                    i++;
                }
            }
            System.out.println("Done (" + i + ")");
        }
    }

    private void loadConcepts(String fileName) throws IOException, SQLException {
        System.out.println("Importing concepts...");
        try (BufferedReader br = new BufferedReader(new FileReader(fileName))) {
            // header
            br.readLine();
            int i = 1;

            try (PreparedStatement stmt = conn.prepareStatement("REPLACE INTO concept (iri, name, description, ontology) SELECT ?, ?, ?, id FROM ontology WHERE prefix = ?")) {
                String line;
                while ((line = br.readLine()) != null) {
                    String[] fields = line.split("\t");
                    stmt.setString(1, fields[0]);
                    stmt.setString(2, fields[1]);
                    // status = fields[2]
                    stmt.setString(3, (fields.length == 4) ? fields[3] : null);
                    stmt.setString(4, getPrefix(fields[0]));
                    if (stmt.executeUpdate() == 0)
                        System.err.println("Error upserting concept row " + (i+1) + " - [" + line + "]");

                    i++;
                }
            }
            System.out.println("Done (" + i + ")");
        }
    }

    private void loadConceptPropertyObject() throws IOException, SQLException {
        System.out.println("Importing concept property objects...");
        try (BufferedReader br = new BufferedReader(new FileReader("./ConceptPropertyObject.txt"))) {
            // header
            br.readLine();
            int i = 1;
            String sql = "REPLACE INTO concept_property_object (id, property, value)\n" +
                "SELECT c.id, p.id, v.id\n" +
                "FROM concept c\n" +
                "JOIN concept p\n" +
                "JOIN concept v\n" +
                "WHERE c.iri = ?\n" +
                "AND p.iri = ?\n" +
                "AND v.iri = ?\n";

            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                String line;
                while ((line = br.readLine()) != null) {
                    String[] fields = line.split("\t");
                    stmt.setString(1, fields[0]);
                    // group = fields[1]
                    stmt.setString(2, fields[2]);
                    stmt.setString(3, fields[3]);
                    if (stmt.executeUpdate() == 0)
                        System.err.println("Error upserting concept_property_object row " + (i+1) + " - [" + line + "]");

                    i++;
                }
            }
            System.out.println("Done (" + i + ")");
        }
    }

    private void loadConceptDataModel() throws IOException, SQLException {
        System.out.println("Importing concept data models...");
        try (BufferedReader br = new BufferedReader(new FileReader("./DataModel.txt"))) {
            // header
            br.readLine();
            int i = 1;

            String sql = "REPLACE INTO concept_data_model (id, property, min_cardinality, max_cardinality, value_type, property_level, property_owner) \n" +
                "SELECT c.id, p.id, ?, ?, v.id, ?, o.id\n" +
                "FROM concept c\n" +
                "JOIN concept p\n" +
                "JOIN concept v\n" +
                "JOIN concept o\n" +
                "WHERE c.iri = ?\n" +
                "AND p.iri = ?\n" +
                "AND v.iri = ?\n" +
                "AND o.iri = ?\n";

            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                String line;
                while ((line = br.readLine()) != null) {
                    String[] fields = line.split("\t");
                    stmt.setString(1, fields[3].isEmpty() ? null : fields[3]);
                    stmt.setString(2, fields[4].isEmpty() ? null : fields[4]);
                    stmt.setString(3, fields[5]);
                    stmt.setString(4, fields[0]);
                    stmt.setString(5, fields[1]);
                    stmt.setString(6, fields[2]);
                    stmt.setString(7, fields[6]);
                    if (stmt.executeUpdate() == 0)
                        System.err.println("Error upserting concept_data_model row " + (i+1) + " - [" + line + "]");

                    i++;
                }
            }
            System.out.println("Done (" + i + ")");
        }
    }

    private String getPrefix(String iri) {
        int i = iri.indexOf(':');
        if (i > -1)
            return iri.substring(0, i+1);
        else
            return ":";
    }
}
