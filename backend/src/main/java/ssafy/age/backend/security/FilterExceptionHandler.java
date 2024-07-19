package ssafy.age.backend.security;

import ch.qos.logback.core.spi.ErrorCodes;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.web.filter.OncePerRequestFilter;
import ssafy.age.backend.member.exception.MemberBadRequestException;

import java.io.IOException;

public class FilterExceptionHandler extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (MemberBadRequestException e) {
            serErrorResponse(response, HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    private void serErrorResponse(HttpServletResponse response, HttpStatus httpStatus, String msg) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        response.setStatus(httpStatus.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        try {
            response.getWriter().write(objectMapper.writeValueAsString(ProblemDetail.forStatusAndDetail(httpStatus, msg)));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
