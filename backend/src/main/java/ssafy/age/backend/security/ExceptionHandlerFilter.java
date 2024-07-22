package ssafy.age.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import ssafy.age.backend.auth.exception.InvalidTokenException;
import ssafy.age.backend.member.exception.MemberBadRequestException;

import java.io.IOException;

@Component
public class ExceptionHandlerFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (MemberBadRequestException e) {
            setErrorResponse(HttpStatus.BAD_REQUEST, request, response, e);
        } catch (InvalidTokenException e) {
            setErrorResponse(HttpStatus.UNAUTHORIZED, request, response, e);
        }
    }

    public void setErrorResponse(HttpStatusCode httpStatusCode, HttpServletRequest request, HttpServletResponse response, Throwable e) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();

        response.setStatus(httpStatusCode.value());
        response.setContentType("application/json; charset=utf-8");
        response.getWriter().write(
                objectMapper.writeValueAsString(
                        ProblemDetail.forStatusAndDetail(
                                httpStatusCode,
                                e.getMessage()
                        )
                )

        );
    }

}
