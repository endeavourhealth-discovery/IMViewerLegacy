package org.endeavourhealth.imviewer.common.dal;

import java.sql.Connection;
import java.sql.SQLException;

public class BaseJDBCDAL implements AutoCloseable {
    protected Connection conn;

    public BaseJDBCDAL() {
        conn = ConnectionPool.getInstance().pop();
    }

    public void beginTransaction() throws SQLException {
        this.conn.setAutoCommit(false);
    }

    public void commit() throws SQLException {
        this.conn.commit();
    }

    public void rollback() throws SQLException {
        this.conn.rollback();
    }

    @Override
    public void close() throws Exception {
        if (conn != null) {
            conn.setAutoCommit(false);
            ConnectionPool.getInstance().push(conn);
        }
    }

}
