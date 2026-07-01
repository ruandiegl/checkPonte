--
-- PostgreSQL database dump
--

\restrict mZTzrsVticJtNTuJeeOnvLXQ4WRchnfk1DPHj4j3oCfm71GIVixAwVFWqh2D7KD

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

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
-- Name: InspectionStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."InspectionStatus" AS ENUM (
    'OK',
    'NC',
    'IMP'
);


--
-- Name: ResultAnswer; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ResultAnswer" AS ENUM (
    'C',
    'NC'
);


--
-- Name: Role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Role" AS ENUM (
    'master',
    'operator'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: checklist_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.checklist_items (
    id integer NOT NULL,
    description text NOT NULL,
    is_imperative boolean DEFAULT false NOT NULL,
    active boolean DEFAULT true NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: checklist_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.checklist_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: checklist_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.checklist_items_id_seq OWNED BY public.checklist_items.id;


--
-- Name: equipment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.equipment (
    id integer NOT NULL,
    name character varying(120) NOT NULL,
    description character varying(200),
    location character varying(200),
    active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: equipment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.equipment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: equipment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.equipment_id_seq OWNED BY public.equipment.id;


--
-- Name: inspection_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inspection_results (
    id integer NOT NULL,
    inspection_id integer NOT NULL,
    item_id integer NOT NULL,
    answer public."ResultAnswer" NOT NULL,
    observation text
);


--
-- Name: inspection_results_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.inspection_results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: inspection_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.inspection_results_id_seq OWNED BY public.inspection_results.id;


--
-- Name: inspections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inspections (
    id integer NOT NULL,
    equipment_id integer NOT NULL,
    inspection_date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    location character varying(200),
    user_id integer NOT NULL,
    observations text,
    status public."InspectionStatus" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: inspections_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.inspections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: inspections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.inspections_id_seq OWNED BY public.inspections.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    login character varying(50) NOT NULL,
    email character varying(200),
    password_hash text NOT NULL,
    role public."Role" NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: checklist_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.checklist_items ALTER COLUMN id SET DEFAULT nextval('public.checklist_items_id_seq'::regclass);


--
-- Name: equipment id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.equipment ALTER COLUMN id SET DEFAULT nextval('public.equipment_id_seq'::regclass);


--
-- Name: inspection_results id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inspection_results ALTER COLUMN id SET DEFAULT nextval('public.inspection_results_id_seq'::regclass);


--
-- Name: inspections id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inspections ALTER COLUMN id SET DEFAULT nextval('public.inspections_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
52aa4834-3ba3-427c-a607-37cecca94e3e	f929c7e65404b2bc0c69ca88172a68ecacc52a98f043b3430dd067139c1d50ca	2026-06-30 13:13:00.077878+00	20260630131300_init	\N	\N	2026-06-30 13:13:00.040993+00	1
\.


--
-- Data for Name: checklist_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.checklist_items (id, description, is_imperative, active, order_index, created_at) FROM stdin;
1	Controle de acionamento em condições de uso?	t	t	1	2026-06-30 13:13:19.576
2	Trava de segurança do gancho funcionando?	t	t	2	2026-06-30 13:13:19.576
3	Estado dos cabos de aço	t	t	3	2026-06-30 13:13:19.576
4	Funcionamento da sirene de alerta	t	t	4	2026-06-30 13:13:19.576
5	Lubrificação das engrenagens	f	t	5	2026-06-30 13:13:19.576
6	Limpeza da cabine	f	t	6	2026-06-30 13:13:19.576
7	Iluminação de trabalho	f	t	7	2026-06-30 13:13:19.576
\.


--
-- Data for Name: equipment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.equipment (id, name, description, location, active, created_at) FROM stdin;
1	Ponte Rolante 01	Capacidade 10t	Galpão A	t	2026-06-30 13:13:19.573
2	Ponte Rolante 02	Capacidade 5t	Galpão B	t	2026-06-30 13:13:19.573
3	Ponte Rolante 03	Capacidade 20t	Galpão C	t	2026-06-30 13:13:19.573
\.


--
-- Data for Name: inspection_results; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.inspection_results (id, inspection_id, item_id, answer, observation) FROM stdin;
1	1	1	C	\N
2	1	2	C	\N
3	1	3	C	\N
4	1	4	C	\N
5	1	5	C	\N
6	1	6	C	\N
7	1	7	C	\N
8	2	1	C	\N
9	2	2	C	\N
10	2	3	C	cabo arrebentado
11	2	4	C	\N
12	2	5	NC	sem óleo
13	2	6	C	\N
14	2	7	C	\N
15	3	1	C	\N
16	3	2	C	\N
17	3	3	C	\N
18	3	4	C	\N
19	3	5	NC	sem óleo
20	3	6	NC	vassoura quebrou
21	3	7	NC	luz explodiu
\.


--
-- Data for Name: inspections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.inspections (id, equipment_id, inspection_date, location, user_id, observations, status, created_at) FROM stdin;
1	1	2026-06-30 13:15:42.435	\N	1	\N	OK	2026-06-30 13:15:42.437
2	2	2026-06-30 13:33:32.089	\N	1	\N	NC	2026-06-30 13:33:32.091
3	3	2026-06-30 14:04:05.566	\N	1	\N	NC	2026-06-30 14:04:05.568
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, login, email, password_hash, role, active, created_at) FROM stdin;
1	Administrador Master	admin	admin@vulcano.local	$2a$12$9R9RAmITtlsXHf580qG8Fej9zI58Bz/eAu5CWiIdVguCMJeOzq0CC	master	t	2026-06-30 13:13:19.561
2	Operador Teste	operador	operador@vulcano.local	$2a$12$9R9RAmITtlsXHf580qG8Fej9zI58Bz/eAu5CWiIdVguCMJeOzq0CC	operator	t	2026-06-30 13:13:19.57
\.


--
-- Name: checklist_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.checklist_items_id_seq', 7, true);


--
-- Name: equipment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.equipment_id_seq', 3, true);


--
-- Name: inspection_results_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.inspection_results_id_seq', 21, true);


--
-- Name: inspections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.inspections_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: checklist_items checklist_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.checklist_items
    ADD CONSTRAINT checklist_items_pkey PRIMARY KEY (id);


--
-- Name: equipment equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_pkey PRIMARY KEY (id);


--
-- Name: inspection_results inspection_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inspection_results
    ADD CONSTRAINT inspection_results_pkey PRIMARY KEY (id);


--
-- Name: inspections inspections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inspections
    ADD CONSTRAINT inspections_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: checklist_items_description_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX checklist_items_description_key ON public.checklist_items USING btree (description);


--
-- Name: equipment_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX equipment_name_key ON public.equipment USING btree (name);


--
-- Name: users_login_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_login_key ON public.users USING btree (login);


--
-- Name: inspection_results inspection_results_inspection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inspection_results
    ADD CONSTRAINT inspection_results_inspection_id_fkey FOREIGN KEY (inspection_id) REFERENCES public.inspections(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: inspection_results inspection_results_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inspection_results
    ADD CONSTRAINT inspection_results_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.checklist_items(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: inspections inspections_equipment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inspections
    ADD CONSTRAINT inspections_equipment_id_fkey FOREIGN KEY (equipment_id) REFERENCES public.equipment(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: inspections inspections_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inspections
    ADD CONSTRAINT inspections_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict mZTzrsVticJtNTuJeeOnvLXQ4WRchnfk1DPHj4j3oCfm71GIVixAwVFWqh2D7KD

