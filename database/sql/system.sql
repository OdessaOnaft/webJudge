DELETE FROM pg_proc WHERE proname LIKE 'system\_%';
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function system_get_solutions_for_queue(bigint) returns TABLE(solution_id bigint) as
$$
begin
    RETURN QUERY
        SELECT
            s.id
        FROM solutions s
        WHERE
            s.status = 'waiting'
        ORDER BY created ASC
        OFFSET $1
        LIMIT 10;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function system_get_problem(bigint) returns TABLE (problem_id bigint, time_limit bigint, memory_limit bigint, output_type varchar, user_id bigint) as
$$
begin
    return query
        SELECT
            p.id,
            p.time_limit,
            p.memory_limit,
            p.output_type,
            p.user_id
        FROM problems p WHERE p.id = $1;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function system_get_solution(bigint) returns TABLE(solution_id bigint, user_id bigint, problem_id bigint, status varchar, lang varchar) as
$$
begin
    RETURN QUERY
        SELECT
            s.id,
            s.user_id,
            s.problem_id,
            s.status,
            s.lang
        FROM solutions s
        WHERE s.id = $1;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function system_get_solution_tests(bigint) returns TABLE(test_id bigint, solution_id bigint, created bigint, status varchar, num bigint) as
$$
begin
    RETURN QUERY
        SELECT
            st.id,
            st.solution_id,
            st.created,
            st.status,
            st.num
        FROM solution_tests st
        WHERE st.solution_id = $1
        ORDER BY st.num ASC;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function system_set_solution_test_result(bigint, bigint, varchar, bigint, bigint, varchar) returns TABLE(result boolean) as
$$
begin
    UPDATE solution_tests SET status = $3, exec_time = $4, exec_memory = $5, message = $6 WHERE solution_id = $1 AND num = $2;
    RETURN QUERY SELECT FOUND;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function system_set_solution_result(bigint, varchar, varchar) returns TABLE(result boolean) as
$$
begin
    UPDATE solutions SET status = $2, message = $3 WHERE id = $1;
    RETURN QUERY SELECT FOUND;
end;
$$ language plpgsql;