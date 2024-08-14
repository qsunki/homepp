package ssafy.age.backend.global;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Profile({"dev", "local"})
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    private static final ThreadLocal<Integer> callDepth = ThreadLocal.withInitial(() -> 0);

    @Pointcut("execution(* ssafy..controller..*(..))")
    public void controllerLayer() {}

    @Pointcut("execution(* ssafy..service..*(..))")
    public void serviceLayer() {}

    @Pointcut("execution(* ssafy..persistence..*(..))")
    public void repositoryLayer() {}

    @Pointcut("execution(* ssafy..member..*(..)) || execution(* ssafy..security..*(..))")
    public void sensitiveInfo() {}

    @Around("(controllerLayer() || serviceLayer() || repositoryLayer()) && !sensitiveInfo()")
    public Object logMethod(ProceedingJoinPoint joinPoint) throws Throwable {
        int depth = callDepth.get();
        callDepth.set(depth + 1);
        String indent = " ".repeat(depth * 2);

        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        Object[] args = joinPoint.getArgs();

        logger.debug(
                "{}[DEPTH {}] [{}]: [{}] parameters: [{}]",
                indent,
                depth,
                className,
                methodName,
                args);

        Object result;
        try {
            result = joinPoint.proceed();
            logger.debug(
                    "{}[DEPTH {}] [{}]: [{}] returned: [{}]",
                    indent,
                    depth,
                    className,
                    methodName,
                    result);
        } catch (Exception e) {
            logger.error(
                    "{}[DEPTH {}] [{}]: [{}] threw an exception: [{}]",
                    indent,
                    depth,
                    className,
                    methodName,
                    e.getMessage());
            throw e;
        } finally {
            callDepth.set(depth);
        }

        return result;
    }
}
