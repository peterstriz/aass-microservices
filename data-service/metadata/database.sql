SET check_function_bodies = false;
CREATE TABLE public.booking (
    id integer NOT NULL,
    saloon_id integer NOT NULL,
    date timestamp with time zone NOT NULL,
    status text NOT NULL,
    service_ids text NOT NULL
);
CREATE SEQUENCE public.booking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.booking_id_seq OWNED BY public.booking.id;
CREATE TABLE public.employee (
    id integer NOT NULL,
    name text NOT NULL,
    saloon_id integer NOT NULL
);
CREATE SEQUENCE public.employee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.employee_id_seq OWNED BY public.employee.id;
CREATE TABLE public.saloon (
    id integer NOT NULL,
    name text NOT NULL
);
CREATE SEQUENCE public.saloon_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.saloon_id_seq OWNED BY public.saloon.id;
CREATE TABLE public.services (
    id integer NOT NULL,
    name text NOT NULL,
    saloon_id integer NOT NULL
);
CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;
ALTER TABLE ONLY public.booking ALTER COLUMN id SET DEFAULT nextval('public.booking_id_seq'::regclass);
ALTER TABLE ONLY public.employee ALTER COLUMN id SET DEFAULT nextval('public.employee_id_seq'::regclass);
ALTER TABLE ONLY public.saloon ALTER COLUMN id SET DEFAULT nextval('public.saloon_id_seq'::regclass);
ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);
COPY public.booking (id, saloon_id, date, status, service_ids) FROM stdin;
2	1	2023-04-13 12:01:19.881+00	open	1,2
3	1	2023-04-13 12:01:19.881+00	open	1,2
4	1	2023-04-13 12:17:16.511+00	open	1,2}
5	1	2023-04-13 12:19:38.673+00	open	3,2}
6	1	2023-04-13 12:19:38.673+00	open	3,2}
7	1	2023-04-13 12:19:38.673+00	open	3,2}
8	1	2023-04-13 12:22:08.067+00	open	1,3}
9	1	2023-04-13 12:24:06.923+00	open	3,4
11	1	2023-04-13 12:33:02.178+00	rejected	1,2
12	1	2023-04-13 12:34:17.209+00	rejected	3
10	1	2023-04-06 12:24:15.378+00	approved	3,2
13	1	2023-04-13 12:46:28.527+00	approved	2,3
14	1	2023-04-13 12:53:55.809+00	approved	1
\.
COPY public.employee (id, name, saloon_id) FROM stdin;
1	Marko	1
2	Peto	2
3	Jozo	1
4	Fero	1
5	Samo	2
6	Majka	3
7	Lucia	4
8	Iva	4
\.
COPY public.saloon (id, name) FROM stdin;
1	Gold Barber
2	Salón Bibou
3	Kaderníctvo Adam
4	Kaderníctvo Bea
\.
COPY public.services (id, name, saloon_id) FROM stdin;
1	vlasy	1
2	farbenie	1
3	pansky strih	1
4	damsky strih	1
\.
SELECT pg_catalog.setval('public.booking_id_seq', 14, true);
SELECT pg_catalog.setval('public.employee_id_seq', 8, true);
SELECT pg_catalog.setval('public.saloon_id_seq', 4, true);
SELECT pg_catalog.setval('public.services_id_seq', 4, true);
ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.employee
    ADD CONSTRAINT employee_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.saloon
    ADD CONSTRAINT saloon_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_saloon_id_fkey FOREIGN KEY (saloon_id) REFERENCES public.saloon(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.employee
    ADD CONSTRAINT employee_saloon_id_fkey FOREIGN KEY (saloon_id) REFERENCES public.saloon(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_saloon_id_fkey FOREIGN KEY (saloon_id) REFERENCES public.saloon(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
