DELETE FROM pg_proc WHERE proname LIKE 'student\_%';
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function student_get_profile(bigint) returns TABLE (name varchar, birthday varchar,  phone varchar, email varchar, note varchar, modified_scope varchar, created bigint, modified bigint, user_id bigint, scope varchar) as
$$
begin
    return query
    SELECT
        u.name,
        u.birthday,
        u.phone,
        u.email,
        u.note,
        u.modified_scope,
        u.created,
        u.modified,
        u.id,
        s.value
    FROM
        users u JOIN scope s ON s.id = u.scope_id
    WHERE
        u.id = $1;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function student_submit_profile(bigint, varchar, varchar, varchar, varchar, varchar) returns boolean as
$$
begin
    UPDATE users SET name = $2, birthday = $3, phone = $4, note = $5, modified_scope = $6 WHERE id = $1;
    RETURN FOUND;
end;
$$ language plpgsql
CALLED ON NULL INPUT;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function student_logout(bigint) returns boolean as
$$
begin
  DELETE FROM users_token WHERE user_id = $1;
  RETURN FOUND;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function student_submit_solution(bigint, bigint, varchar) returns TABLE(solution_id bigint) as
$$
<<fn>>
declare
    solution_id bigint;
    tests_pos bigint := 1;
    tests_count bigint;
begin
    INSERT INTO solutions(user_id, problem_id, lang) VALUES ($1, $2, $3);
    SELECT lastval() INTO fn.solution_id;
    SELECT p.tests_count INTO fn.tests_count FROM problems p WHERE p.id = $2;
    LOOP
        INSERT INTO solution_tests (solution_id, status, num) VALUES (fn.solution_id, 'waiting', tests_pos);
        tests_pos := tests_pos + 1;
        IF fn.tests_pos > fn.tests_count THEN
            EXIT;
        END IF;
    END LOOP;
    RETURN QUERY SELECT fn.solution_id;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function student_get_my_solutions(bigint, bigint, bigint) returns TABLE(solution_id bigint) as
$$
begin
    RETURN QUERY
        SELECT
            s.id,
            s.problem_id,
            s.created,
            s.status,
            s.lang
        FROM solutions s
        WHERE s.user_id = $1
        ORDER BY created DESC
        OFFSET $2
        LIMIT $3;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------