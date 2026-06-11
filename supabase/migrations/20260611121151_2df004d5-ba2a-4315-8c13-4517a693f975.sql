
ALTER TABLE public.reels ADD COLUMN IF NOT EXISTS is_visible boolean NOT NULL DEFAULT true;
ALTER TABLE public.reels ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.reels ALTER COLUMN cover_url DROP NOT NULL;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$
LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_reels_updated_at ON public.reels;
CREATE TRIGGER update_reels_updated_at BEFORE UPDATE ON public.reels
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Public-read policy on storage objects for our buckets
CREATE POLICY "Public read reel-media" ON storage.objects FOR SELECT
USING (bucket_id IN ('reel-covers','reel-videos'));

CREATE POLICY "Admins upload reel-media" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id IN ('reel-covers','reel-videos') AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update reel-media" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id IN ('reel-covers','reel-videos') AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete reel-media" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id IN ('reel-covers','reel-videos') AND public.has_role(auth.uid(), 'admin'));
