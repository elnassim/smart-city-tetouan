package com.smartcity.traffic.security;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.source.RemoteJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.JWSKeySelector;
import com.nimbusds.jose.proc.JWSVerificationKeySelector;
import com.nimbusds.jose.proc.SecurityContext;
import com.nimbusds.jwt.SignedJWT;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.proc.DefaultJWTProcessor;

import java.net.URL;

public class JwtVerifier {
    private final DefaultJWTProcessor<SecurityContext> jwtProcessor;

    public JwtVerifier(String jwksUrl) throws Exception {
        jwtProcessor = new DefaultJWTProcessor<>();
        JWKSource<SecurityContext> keySource = new RemoteJWKSet<>(new URL(jwksUrl));
        JWSKeySelector<SecurityContext> keySelector = new JWSVerificationKeySelector<>(JWSAlgorithm.RS256, keySource);
        jwtProcessor.setJWSKeySelector(keySelector);
    }

    public JWTClaimsSet verify(String token) throws Exception {
        SignedJWT signedJWT = SignedJWT.parse(token);
        return jwtProcessor.process(signedJWT, null);
    }
}
