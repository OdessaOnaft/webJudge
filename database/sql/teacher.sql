DELETE FROM pg_proc WHERE proname LIKE 'teacher\_%';
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function teacher_add_problem(bigint, varchar[], bigint, bigint, varchar[], varchar, varchar, bigint, varchar, varchar) returns TABLE (problem_id bigint) as
$$
<<fn>>
declare
    a_row varchar;
    problem_id bigint;
begin
    INSERT INTO problems (user_id, created, time_limit, memory_limit, tests, output_type, tests_count, input, output) VALUES ($1, current_milliseconds(), $3, $4, $6, $7, $8, $9, $10);
    SELECT lastval() INTO fn.problem_id;
    FOREACH fn.a_row IN ARRAY $2 LOOP
            INSERT INTO locale_strings (lang, value, related_id, related_type) VALUES ((fn.a_row::json)->>'lang', (fn.a_row::json)->>'value', fn.problem_id, 'name');
    END LOOP;
    FOREACH fn.a_row IN ARRAY $5 LOOP
        INSERT INTO locale_strings (lang, value, related_id, related_type) VALUES ((fn.a_row::json)->>'lang', (fn.a_row::json)->>'value', fn.problem_id, 'description');
    END LOOP;
    return query
        SELECT
            fn.problem_id;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function teacher_edit_problem(bigint, bigint, varchar[], bigint, bigint, varchar[], varchar, varchar, bigint, varchar, varchar) returns TABLE (result boolean) as
$$
<<fn>>
declare
    a_row varchar;
    result boolean;
begin
    UPDATE problems SET time_limit = $4, memory_limit = $5, tests = $7, output_type = $8, tests_count = $9, input = $10, output = $11 WHERE user_id = $1 AND id = $2;
    SELECT found INTO fn.result;
    IF fn.result THEN
        DELETE FROM locale_strings WHERE related_id = $2;
        FOREACH fn.a_row IN ARRAY $3 LOOP
            INSERT INTO locale_strings (lang, value, related_id, related_type) VALUES ((fn.a_row::json)->>'lang', (fn.a_row::json)->>'value', $2, 'name');
        END LOOP;
        FOREACH fn.a_row IN ARRAY $6 LOOP
            INSERT INTO locale_strings (lang, value, related_id, related_type) VALUES ((fn.a_row::json)->>'lang', (fn.a_row::json)->>'value', $2, 'description');
        END LOOP;
    END IF;
    return query
    SELECT
        fn.result;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function teacher_get_problem_full(bigint, bigint) returns TABLE (problem_id bigint, name varchar[], created bigint, time_limit bigint, memory_limit bigint, description varchar[], samples varchar, output_type varchar, user_id bigint, input varchar, output varchar, total_solutions_count bigint, success_solutions_count bigint, total_unique_solutions_count bigint, success_unique_solutions_count bigint) as
$$
begin
    return query
        SELECT
            p.id,
            (SELECT array_agg(('{"lang":"' || ls.lang || '","name":"' || ls.value || '"}')::varchar) FROM locale_strings ls WHERE ls.related_id = p.id AND ls.related_type = 'name'),
            p.created,
            p.time_limit,
            p.memory_limit,
            (SELECT array_agg(('{"lang":"' || ls.lang || '","description":"' || ls.value || '"}')::varchar) FROM locale_strings ls WHERE ls.related_id = p.id AND ls.related_type = 'description'),
            p.tests,
            p.output_type,
            p.user_id,
            ''::varchar,
            ''::varchar,
            (SELECT COUNT(*) FROM solutions s WHERE s.problem_id = p.id),
            (SELECT COUNT(*) FROM solutions s WHERE s.problem_id = p.id AND s.status = 'ok'::varchar),
            (SELECT COUNT(*) FROM (SELECT DISTINCT s.user_id FROM solutions s WHERE s.problem_id = p.id) AS t1),
            (SELECT COUNT(*) FROM (SELECT DISTINCT s.user_id FROM solutions s WHERE s.problem_id = p.id AND s.status = 'ok'::varchar) AS t2)
        FROM problems p WHERE p.id = $1 AND p.user_id = $2;
    IF NOT FOUND THEN
        raise exception 'Permissions denied';
    END IF;
end;
$$ language plpgsql
CALLED ON NULL INPUT;