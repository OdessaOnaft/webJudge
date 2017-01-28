CREATE DATABASE "webjudge";
CREATE EXTENSION pgcrypto;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function current_milliseconds() returns bigint as
$$
begin
  RETURN (SELECT (EXTRACT(EPOCH FROM current_timestamp) * 1000) ::bigint);
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
create or replace function random_string(length integer) returns text as
$$
declare
  chars text[] := '{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z}';
  result text := '';
  i integer := 0;
begin
  if length < 0 then
    raise exception 'Given length cannot be less than 0';
  end if;
  for i in 1..length loop
    result := result || chars[1+random()*(array_length(chars, 1)-1)];
  end loop;
  return result;
end;
$$ language plpgsql;
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
CREATE TABLE "scope" (
	"id" bigserial NOT NULL,
	"value" varchar NOT NULL,
	CONSTRAINT scope_pk PRIMARY KEY (id)
);
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
INSERT INTO scope (value) VALUES ('student'), ('teacher'), ('admin');
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
CREATE TABLE "users" (
	"id" bigserial NOT NULL,
	"scope_id" bigint NOT NULL DEFAULT (1),
	"password" varchar NOT NULL,
	"email" varchar NOT NULL,
	"birthday" varchar,
	"phone" varchar,
	"name" varchar,
	"note" varchar,
	"modified_scope" varchar,
    "created" bigint NOT NULL DEFAULT current_milliseconds(),
	"modified" bigint,
	"is_visible" boolean NOT NULL DEFAULT true,
	CONSTRAINT users_pk PRIMARY KEY (id),
	CONSTRAINT users_fk0 FOREIGN KEY (scope_id) REFERENCES scope(id) ON DELETE CASCADE
);
---------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------
CREATE TABLE "users_token" (
	"id" bigserial NOT NULL,
	"user_id" bigint NOT NULL,
	"value" varchar NOT NULL,
	"expires" timestamp NOT NULL DEFAULT (current_timestamp + INTERVAL'1 week'),
	CONSTRAINT users_token_pk PRIMARY KEY (id),
	CONSTRAINT users_token_fk0 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);