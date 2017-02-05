DELETE FROM pg_proc WHERE proname LIKE 'admin\_%';
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function admin_reject_scope(bigint) returns TABLE(result boolean) as
$$
begin
    UPDATE users SET modified_scope = null WHERE id = $1;
    RETURN QUERY SELECT FOUND;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function admin_accept_scope(bigint) returns TABLE(result boolean) as
$$
begin
    UPDATE users SET scope_id = (SELECT id FROM scope WHERE value = modified_scope), modified_scope = null WHERE id = $1;
    RETURN QUERY SELECT FOUND;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function admin_add_news(bigint, varchar[], varchar[]) returns TABLE(news_id bigint) as
$$
<<fn>>
declare
    a_row varchar;
    news_id bigint;
begin
    INSERT INTO news (user_id) VALUES ($1);
    SELECT lastval() INTO fn.news_id;
    FOREACH fn.a_row IN ARRAY $2 LOOP
        INSERT INTO locale_strings (lang, value, related_id, related_type) VALUES ((fn.a_row::json)->>'lang', (fn.a_row::json)->>'value', fn.news_id, 'title');
    END LOOP;
    FOREACH fn.a_row IN ARRAY $3 LOOP
        INSERT INTO locale_strings (lang, value, related_id, related_type) VALUES ((fn.a_row::json)->>'lang', (fn.a_row::json)->>'value', fn.news_id, 'body');
    END LOOP;
    return query
        SELECT
            fn.news_id;

end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function admin_edit_news(bigint, bigint, varchar[], varchar[]) returns TABLE(news_id bigint) as
$$
<<fn>>
declare
    a_row varchar;
begin
    DELETE FROM locale_strings WHERE related_id = $2;
    FOREACH fn.a_row IN ARRAY $3 LOOP
        INSERT INTO locale_strings (lang, value, related_id, related_type) VALUES ((fn.a_row::json)->>'lang', (fn.a_row::json)->>'value', fn.news_id, 'title');
    END LOOP;
    FOREACH fn.a_row IN ARRAY $4 LOOP
        INSERT INTO locale_strings (lang, value, related_id, related_type) VALUES ((fn.a_row::json)->>'lang', (fn.a_row::json)->>'value', fn.news_id, 'body');
    END LOOP;
    return query
        SELECT
            fn.news_id;

end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------