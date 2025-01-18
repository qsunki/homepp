package ssafy.age.backend.testutil;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.BiConsumer;
import java.util.function.Function;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.FluentQuery;

@SuppressWarnings("ALL")
public abstract class MemoryJpaRepository<T> implements JpaRepository<T, Long> {
    private final BiConsumer<T, Long> setIdFunction;
    private final Function<T, Long> getIdFunction;

    protected final Map<Long, T> store = new HashMap<>();
    protected java.lang.Long sequence = 1L;

    protected MemoryJpaRepository(BiConsumer<T, Long> setIdFunction, Function<T, Long> getIdFunction) {
        this.setIdFunction = setIdFunction;
        this.getIdFunction = getIdFunction;
    }

    @Override
    public <S extends T> S save(S entity) {
        Long id = getIdFunction.apply(entity);
        if (id != null) {
            store.put(id, entity);
            return entity;
        }
        while (store.containsKey(sequence++)) {
            sequence++;
        }
        setIdFunction.accept(entity, sequence);
        store.put(sequence, entity);
        return entity;
    }

    @Override
    public List<T> findAll() {
        return store.values().stream().toList();
    }

    @Override
    public Optional<T> findById(Long id) {
        return Optional.ofNullable(store.get(id));
    }

    @Override
    public T getReferenceById(Long id) {
        return store.get(id);
    }

    @Override
    public void deleteById(Long id) {
        store.remove(id);
    }

    @Override
    public void delete(T entity) {
        Long id = getIdFunction.apply(entity);
        store.remove(id);
    }

    @Override
    public void deleteAllInBatch(Iterable<T> entities) {
        throw new NotImplementedException();
    }

    @Override
    public void flush() {
        throw new NotImplementedException();
    }

    @Override
    public <S extends T> S saveAndFlush(S entity) {
        throw new NotImplementedException();
    }

    @Override
    public <S extends T> List<S> saveAllAndFlush(Iterable<S> entities) {
        throw new NotImplementedException();
    }

    @Override
    public void deleteAllByIdInBatch(Iterable<Long> ids) {
        throw new NotImplementedException();
    }

    @Override
    public void deleteAllInBatch() {
        throw new NotImplementedException();
    }

    @Override
    public T getOne(Long id) {
        throw new NotImplementedException();
    }

    @Override
    public T getById(Long id) {
        throw new NotImplementedException();
    }

    @Override
    public <S extends T> List<S> findAll(Example<S> example) {
        throw new NotImplementedException();
    }

    @Override
    public <S extends T> List<S> findAll(Example<S> example, Sort sort) {
        throw new NotImplementedException();
    }

    @Override
    @Deprecated
    public void deleteInBatch(Iterable<T> entities) {
        throw new NotImplementedException();
    }

    @Override
    public <S extends T> List<S> saveAll(Iterable<S> entities) {
        throw new NotImplementedException();
    }

    @Override
    public List<T> findAllById(Iterable<Long> ids) {
        throw new NotImplementedException();
    }

    @Override
    public boolean existsById(Long id) {
        throw new NotImplementedException();
    }

    @Override
    public long count() {
        throw new NotImplementedException();
    }

    @Override
    public void deleteAllById(Iterable<? extends Long> ids) {
        throw new NotImplementedException();
    }

    @Override
    public void deleteAll(Iterable<? extends T> entities) {
        throw new NotImplementedException();
    }

    @Override
    public void deleteAll() {
        throw new NotImplementedException();
    }

    @Override
    public List<T> findAll(Sort sort) {
        throw new NotImplementedException();
    }

    @Override
    public Page<T> findAll(Pageable pageable) {
        throw new NotImplementedException();
    }

    @Override
    public <S extends T> Optional<S> findOne(Example<S> example) {
        throw new NotImplementedException();
    }

    @Override
    public <S extends T> Page<S> findAll(Example<S> example, Pageable pageable) {
        throw new NotImplementedException();
    }

    @Override
    public <S extends T> long count(Example<S> example) {
        throw new NotImplementedException();
    }

    @Override
    public <S extends T> boolean exists(Example<S> example) {
        throw new NotImplementedException();
    }

    @Override
    public <S extends T, R> R findBy(
            Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) {
        throw new NotImplementedException();
    }
}
