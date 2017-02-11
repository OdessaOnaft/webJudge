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
create or replace function admin_get_users(bigint, bigint) returns TABLE(user_id bigint, name varchar, scope varchar, modified_scope varchar, email varchar) as
$$
<<fn>>
begin
    return query
        SELECT
            u.id,
            u.name,
            s.value,
            u.modified_scope,
            u.email
        FROM
            users u JOIN scope s ON s.id = u.scope_id
        ORDER BY
            CASE WHEN u.modified_scope IS NOT NULL THEN 0 ELSE 1 END, u.created DESC
        OFFSET $1
        LIMIT $2;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function admin_get_news_full(bigint) returns TABLE (news_id bigint, title varchar[], created bigint, body varchar[], creator varchar) as
$$
begin
    return query
        SELECT
            n.id,
            (SELECT array_agg(('{"lang":"' || ls.lang || '","title":"' || ls.value || '"}')::varchar) FROM locale_strings ls WHERE ls.related_id = n.id AND ls.related_type = 'title'),
            n.created,
            (SELECT array_agg(('{"lang":"' || ls.lang || '","body":"' || ls.value || '"}')::varchar) FROM locale_strings ls WHERE ls.related_id = n.id AND ls.related_type = 'body'),
            u.name
        FROM news n JOIN users u ON u.id = n.user_id WHERE n.id = $1;
end;
$$ language plpgsql;