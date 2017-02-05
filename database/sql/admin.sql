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