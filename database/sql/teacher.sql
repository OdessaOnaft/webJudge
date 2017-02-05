DELETE FROM pg_proc WHERE proname LIKE 'teacher\_%';
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function teacher_add_problem(bigint, varchar[], bigint, bigint, varchar[], varchar, varchar, bigint) returns TABLE (problem_id bigint) as
$$
<<fn>>
declare
    a_row varchar;
    problem_id bigint;
begin
    INSERT INTO problems (user_id, created, time_limit, memory_limit, tests, output_type, tests_count) VALUES ($1, current_milliseconds(), $3, $4, $6, $7, $8);
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
create or replace function teacher_edit_problem(bigint, bigint, varchar[], bigint, bigint, varchar[], varchar, varchar, bigint) returns TABLE (result boolean) as
$$
<<fn>>
declare
    a_row varchar;
    result boolean;
begin
    UPDATE problems SET time_limit = $4, memory_limit = $5, tests = $7, output_type = $8, tests_count = $9 WHERE user_id = $1 AND id = $2;
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