
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;

DROP POLICY "Anyone can send messages" ON public.contact_messages;
CREATE POLICY "Anyone can send messages" ON public.contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (length(name) BETWEEN 1 AND 200 AND length(email) BETWEEN 3 AND 200 AND length(message) BETWEEN 1 AND 5000);
