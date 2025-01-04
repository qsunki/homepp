package ssafy.age.backend;

import io.micrometer.common.lang.NonNullApi;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.FluentQuery;

@NonNullApi
@NoRepositoryBean
@SuppressWarnings("ALL")
public interface NotJpaRepository<T> extends JpaRepository<T, Long> {
    @Override
    default void flush() {
        throw new NotImplementedException();
    }

    @Override
    default <S extends T> S saveAndFlush(S entity) {
        throw new NotImplementedException();
    }

    @Override
    default <S extends T> List<S> saveAllAndFlush(Iterable<S> entities) {
        throw new NotImplementedException();
    }

    @Override
    default void deleteAllInBatch(Iterable<T> entities) {
        throw new NotImplementedException();
    }

    @Override
    default void deleteAllByIdInBatch(Iterable<Long> ids) {
        throw new NotImplementedException();
    }

    @Override
    default void deleteAllInBatch() {
        throw new NotImplementedException();
    }

    @Override
    default T getOne(Long id) {
        throw new NotImplementedException();
    }

    @Override
    default T getById(Long id) {
        throw new NotImplementedException();
    }

    @Override
    default T getReferenceById(Long id) {
        throw new NotImplementedException();
    }

    @Override
    default <S extends T> List<S> findAll(Example<S> example) {
        throw new NotImplementedException();
    }

    @Override
    default <S extends T> List<S> findAll(Example<S> example, Sort sort) {
        throw new NotImplementedException();
    }

    @Override
    default <S extends T> List<S> saveAll(Iterable<S> entities) {
        throw new NotImplementedException();
    }

    @Override
    default List<T> findAll() {
        throw new NotImplementedException();
    }

    @Override
    default List<T> findAllById(Iterable<Long> ids) {
        throw new NotImplementedException();
    }

    @Override
    default <S extends T> S save(S entity) {
        throw new NotImplementedException();
    }

    @Override
    default Optional<T> findById(Long id) {
        throw new NotImplementedException();
    }

    @Override
    default boolean existsById(Long id) {
        throw new NotImplementedException();
    }

    @Override
    default long count() {
        throw new NotImplementedException();
    }

    @Override
    default void deleteById(Long id) {
        throw new NotImplementedException();
    }

    @Override
    default void delete(T entity) {
        throw new NotImplementedException();
    }

    @Override
    default void deleteAllById(Iterable<? extends Long> ids) {
        throw new NotImplementedException();
    }

    @Override
    default void deleteAll(Iterable<? extends T> entities) {
        throw new NotImplementedException();
    }

    @Override
    default void deleteAll() {
        throw new NotImplementedException();
    }

    @Override
    default List<T> findAll(Sort sort) {
        throw new NotImplementedException();
    }

    @Override
    default Page<T> findAll(Pageable pageable) {
        throw new NotImplementedException();
    }

    @Override
    default <S extends T> Optional<S> findOne(Example<S> example) {
        throw new NotImplementedException();
    }

    @Override
    default <S extends T> Page<S> findAll(Example<S> example, Pageable pageable) {
        throw new NotImplementedException();
    }

    @Override
    default <S extends T> long count(Example<S> example) {
        throw new NotImplementedException();
    }

    @Override
    default <S extends T> boolean exists(Example<S> example) {
        throw new NotImplementedException();
    }

    @Override
    default <S extends T, R> R findBy(
            Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) {
        throw new NotImplementedException();
    }
}
