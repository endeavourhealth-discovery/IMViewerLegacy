package org.endeavourhealth.imviewer.api;

import com.auth0.jwk.Jwk;
import com.auth0.jwk.JwkProvider;
import com.auth0.jwk.JwkProviderBuilder;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.Verification;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URL;
import java.security.interfaces.RSAPublicKey;

public class CognitoFilter implements Filter {
    private String region = null;
    private String poolId = null;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        this.region = filterConfig.getInitParameter("region");
        this.poolId = filterConfig.getInitParameter("pool");
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException {
        HttpServletResponse httpResponse = (HttpServletResponse) servletResponse;
        try {
            String jwt = ((HttpServletRequest) servletRequest).getHeader("authorization").replace("Bearer ", "");
            DecodedJWT decodedJWT = JWT.decode(jwt);
            String url = "https://cognito-idp." + this.region + ".amazonaws.com/" + this.poolId + "/.well-known/jwks.json";
            JwkProvider provider =  new JwkProviderBuilder(new URL(url)).build();
            Jwk jwk = provider.get(decodedJWT.getKeyId());
            Algorithm algorithm = Algorithm.RSA256((RSAPublicKey) jwk.getPublicKey(), null);

            Verification verifier = JWT.require(algorithm);
            verifier.acceptLeeway(30 * 1000).build().verify(decodedJWT);

            validateToken(jwt);

            httpResponse.setStatus(200);
            filterChain.doFilter(servletRequest, servletResponse);
        } catch (Exception e) {
            httpResponse.sendError(401, e.toString());
        }
    }

    private void validateToken(String token) throws IOException {
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            HttpPost post = new HttpPost("https://cognito-idp." + this.region + ".amazonaws.com/");
            post.addHeader("x-amz-target", "AWSCognitoIdentityProviderService.GetUser");
            post.addHeader("content-type", "application/x-amz-json-1.1");
            post.addHeader("Prama", "no-cache");
            post.addHeader("Cache-Control", "no-cache");
            post.setEntity(new StringEntity("{ \"AccessToken\": \"" + token + "\" }"));
            try (CloseableHttpResponse response = client.execute(post)) {
                if (response.getStatusLine().getStatusCode() != 200)
                    throw new TokenExpiredException("Token expired");
            }
        }
    }

    @Override
    public void destroy() {

    }
}
