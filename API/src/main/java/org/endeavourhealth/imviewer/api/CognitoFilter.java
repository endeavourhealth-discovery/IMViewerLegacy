package org.endeavourhealth.imviewer.api;

import org.endeavourhealth.imviewer.common.dal.ViewerJDBCDAL;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class CognitoFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletResponse httpResponse = (HttpServletResponse) servletResponse;
        try {
            String authString = ((HttpServletRequest) servletRequest).getHeader("authorization");

            ViewerJDBCDAL dal = new ViewerJDBCDAL();
            if (!dal.validate(authString))
                httpResponse.setStatus(401);
            else
                httpResponse.setStatus(200);
        } catch (Exception e) {
            httpResponse.setStatus(401, e.toString());
        }
        filterChain.doFilter(servletRequest, servletResponse);
    }

    @Override
    public void destroy() {

    }
}
