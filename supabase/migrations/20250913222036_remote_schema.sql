drop extension if exists "pg_net";

create sequence "public"."daily_characters_id_seq";

create sequence "public"."game_states_id_seq";

create sequence "public"."user_games_id_seq";

create sequence "public"."user_scores_id_seq";


  create table "public"."daily_characters" (
    "id" integer not null default nextval('daily_characters_id_seq'::regclass),
    "name" text,
    "character_id" integer
      );



  create table "public"."game_states" (
    "id" integer not null default nextval('game_states_id_seq'::regclass),
    "user_id" uuid,
    "current_word" character varying(50) not null,
    "attempts" text[] not null default '{}'::text[],
    "completed" boolean not null default false,
    "created_at" timestamp with time zone default now()
      );



  create table "public"."simpson_characters" (
    "id" integer not null,
    "name" character varying(100) not null,
    "image_url" character varying(500) not null,
    "first_season" integer not null,
    "occupation" character varying(100) not null,
    "first_episode" character varying(200) not null,
    "gender" character varying(20) not null,
    "created_at" timestamp with time zone not null,
    "hair_color" character varying(50)
      );



  create table "public"."user_games" (
    "id" integer not null default nextval('user_games_id_seq'::regclass),
    "user_id" uuid,
    "daily_character_id" integer,
    "attempts" text[] not null default '{}'::text[],
    "completed" boolean not null default false,
    "attempts_count" integer not null default 0,
    "created_at" timestamp with time zone default now()
      );



  create table "public"."user_scores" (
    "id" integer not null default nextval('user_scores_id_seq'::regclass),
    "user_id" uuid,
    "word_id" integer,
    "attempts" integer not null default 0,
    "completed" boolean not null default false,
    "time_taken" integer not null default 0,
    "created_at" timestamp with time zone default now()
      );


alter sequence "public"."daily_characters_id_seq" owned by "public"."daily_characters"."id";

alter sequence "public"."game_states_id_seq" owned by "public"."game_states"."id";

alter sequence "public"."user_games_id_seq" owned by "public"."user_games"."id";

alter sequence "public"."user_scores_id_seq" owned by "public"."user_scores"."id";

CREATE UNIQUE INDEX daily_characters_pkey ON public.daily_characters USING btree (id);

CREATE UNIQUE INDEX game_states_pkey ON public.game_states USING btree (id);

CREATE INDEX idx_game_states_completed ON public.game_states USING btree (completed);

CREATE INDEX idx_game_states_user_id ON public.game_states USING btree (user_id);

CREATE INDEX idx_user_games_user_date ON public.user_games USING btree (user_id, daily_character_id);

CREATE UNIQUE INDEX simpson_characters_pkey1 ON public.simpson_characters USING btree (id);

CREATE UNIQUE INDEX user_games_pkey ON public.user_games USING btree (id);

CREATE UNIQUE INDEX user_scores_pkey ON public.user_scores USING btree (id);

alter table "public"."daily_characters" add constraint "daily_characters_pkey" PRIMARY KEY using index "daily_characters_pkey";

alter table "public"."game_states" add constraint "game_states_pkey" PRIMARY KEY using index "game_states_pkey";

alter table "public"."simpson_characters" add constraint "simpson_characters_pkey1" PRIMARY KEY using index "simpson_characters_pkey1";

alter table "public"."user_games" add constraint "user_games_pkey" PRIMARY KEY using index "user_games_pkey";

alter table "public"."user_scores" add constraint "user_scores_pkey" PRIMARY KEY using index "user_scores_pkey";

alter table "public"."game_states" add constraint "game_states_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."game_states" validate constraint "game_states_user_id_fkey";

alter table "public"."simpson_characters" add constraint "simpson_characters_gender_check1" CHECK (((gender)::text = ANY (ARRAY[('Male'::character varying)::text, ('Female'::character varying)::text]))) not valid;

alter table "public"."simpson_characters" validate constraint "simpson_characters_gender_check1";

alter table "public"."user_scores" add constraint "user_scores_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_scores" validate constraint "user_scores_user_id_fkey";


