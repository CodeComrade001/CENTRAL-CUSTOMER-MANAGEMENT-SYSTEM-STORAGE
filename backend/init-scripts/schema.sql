--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13 (Debian 15.13-1.pgdg120+1)
-- Dumped by pg_dump version 15.13 (Debian 15.13-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: verify_admin_login(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.verify_admin_login(p_username text) RETURNS TABLE(out_user_id uuid, out_password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT a.user_id, a.password
  FROM admin a
  WHERE a.username = p_username
    AND a.role = 'admin'
  LIMIT 1;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin (
    id integer NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_login timestamp with time zone,
    failed_attempts integer DEFAULT 0,
    user_id uuid DEFAULT gen_random_uuid() NOT NULL,
    CONSTRAINT admin_role_check CHECK ((role = ANY (ARRAY['super_admin'::text, 'admin'::text, 'moderator'::text])))
);

--
-- insert default account for admin
--

INSERT INTO public.admin (username, email, password, role, is_active)
VALUES 
(
  'Admin_00001',
  'admin@gmail.com',
  '$2b$10$EEDndZh/DtwQXXg5/dmDQe0ztlclnS6kExs10Qy8jZLGv8E8l4QSy',
  'admin',
  true
);

--
-- Name: admin_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admin_id_seq OWNED BY public.admin.id;


--
-- Name: cbt_management; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cbt_management (
    id integer NOT NULL,
    center_name text NOT NULL,
    available_slot integer,
    used_slot integer,
    is_verified boolean DEFAULT false,
    last_slot_purchase timestamp with time zone,
    last_login timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    customer_id text GENERATED ALWAYS AS (('cbt_'::text || id)) STORED,
    number_of_server integer,
    user_id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: cbt_management_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cbt_management_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cbt_management_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cbt_management_id_seq OWNED BY public.cbt_management.id;


--
-- Name: health_management; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.health_management (
    id integer NOT NULL,
    hospital_name text NOT NULL,
    package text NOT NULL,
    renewal_date timestamp with time zone,
    last_payment timestamp with time zone,
    is_verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    customer_id text GENERATED ALWAYS AS (('hms_'::text || id)) STORED,
    user_id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: health_management_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.health_management_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: health_management_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.health_management_id_seq OWNED BY public.health_management.id;


--
-- Name: school_management; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.school_management (
    school_name character varying(50),
    package character varying(50),
    renewal_date character varying(50),
    student_count integer,
    staff_count integer,
    last_payment_date character varying(50),
    is_verified boolean,
    user_id uuid DEFAULT gen_random_uuid() NOT NULL,
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    customer_id text GENERATED ALWAYS AS (('sch_'::text || id)) STORED
);


--
-- Name: school_management_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.school_management_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: school_management_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.school_management_id_seq OWNED BY public.school_management.id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL,
    user_id text
);


--
-- Name: admin id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin ALTER COLUMN id SET DEFAULT nextval('public.admin_id_seq'::regclass);


--
-- Name: cbt_management id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cbt_management ALTER COLUMN id SET DEFAULT nextval('public.cbt_management_id_seq'::regclass);


--
-- Name: health_management id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.health_management ALTER COLUMN id SET DEFAULT nextval('public.health_management_id_seq'::regclass);


--
-- Name: school_management id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_management ALTER COLUMN id SET DEFAULT nextval('public.school_management_id_seq'::regclass);


--
-- Name: admin admin_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_email_key UNIQUE (email);


--
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);


--
-- Name: admin admin_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_username_key UNIQUE (username);


--
-- Name: cbt_management cbt_management_center_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cbt_management
    ADD CONSTRAINT cbt_management_center_name_key UNIQUE (center_name);


--
-- Name: cbt_management cbt_management_customer_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cbt_management
    ADD CONSTRAINT cbt_management_customer_id_key UNIQUE (customer_id);


--
-- Name: cbt_management cbt_management_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cbt_management
    ADD CONSTRAINT cbt_management_pkey PRIMARY KEY (id);


--
-- Name: health_management health_management_customer_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.health_management
    ADD CONSTRAINT health_management_customer_id_key UNIQUE (customer_id);


--
-- Name: health_management health_management_hospital_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.health_management
    ADD CONSTRAINT health_management_hospital_name_key UNIQUE (hospital_name);


--
-- Name: health_management health_management_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.health_management
    ADD CONSTRAINT health_management_pkey PRIMARY KEY (id);


--
-- Name: school_management school_management_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_management
    ADD CONSTRAINT school_management_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- Name: idx_session_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_session_user_id ON public.session USING btree (user_id);


--
-- Name: admin; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.admin ENABLE ROW LEVEL SECURITY;

--
-- Name: admin admin_self_view; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY admin_self_view ON public.admin FOR SELECT TO admin_role USING (true);


--
-- Name: cbt_management; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.cbt_management ENABLE ROW LEVEL SECURITY;

--
-- Name: cbt_management cbt_management_insert_public; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY cbt_management_insert_public ON public.cbt_management FOR INSERT WITH CHECK (true);


--
-- Name: cbt_management cbt_management_select_admin; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY cbt_management_select_admin ON public.cbt_management FOR SELECT USING ((current_setting('app.current_user_role'::text, true) = 'admin'::text));


--
-- Name: cbt_management cbt_management_update_admin; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY cbt_management_update_admin ON public.cbt_management FOR UPDATE USING ((current_setting('app.current_user_role'::text, true) = 'admin'::text));


--
-- Name: health_management; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.health_management ENABLE ROW LEVEL SECURITY;

--
-- Name: health_management health_management_insert_public; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY health_management_insert_public ON public.health_management FOR INSERT WITH CHECK (true);


--
-- Name: health_management health_management_select_admin; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY health_management_select_admin ON public.health_management FOR SELECT USING ((current_setting('app.current_user_role'::text, true) = 'admin'::text));


--
-- Name: health_management health_management_update_admin; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY health_management_update_admin ON public.health_management FOR UPDATE USING ((current_setting('app.current_user_role'::text, true) = 'admin'::text));


--
-- Name: school_management; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.school_management ENABLE ROW LEVEL SECURITY;

--
-- Name: school_management school_management_insert_public; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY school_management_insert_public ON public.school_management FOR INSERT WITH CHECK (true);


--
-- Name: school_management school_management_select_admin; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY school_management_select_admin ON public.school_management FOR SELECT USING ((current_setting('app.current_user_role'::text, true) = 'admin'::text));


--
-- Name: school_management school_management_update_admin; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY school_management_update_admin ON public.school_management FOR UPDATE USING ((current_setting('app.current_user_role'::text, true) = 'admin'::text));


--
-- Name: session; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.session ENABLE ROW LEVEL SECURITY;

--
-- Name: TABLE admin; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,UPDATE ON TABLE public.admin TO public_role;


--
-- Name: TABLE cbt_management; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,UPDATE ON TABLE public.cbt_management TO public_role;
GRANT SELECT,UPDATE ON TABLE public.cbt_management TO admin_role;


--
-- Name: TABLE health_management; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,UPDATE ON TABLE public.health_management TO admin_role;
GRANT SELECT,INSERT,UPDATE ON TABLE public.health_management TO public_role;


--
-- Name: TABLE school_management; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,UPDATE ON TABLE public.school_management TO public_role;


--
-- Name: TABLE session; Type: ACL; Schema: public; Owner: -
--

GRANT SELECT,INSERT,UPDATE ON TABLE public.session TO public_role;


--
-- PostgreSQL database dump complete
--

