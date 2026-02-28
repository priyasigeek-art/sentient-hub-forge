
CREATE TABLE public.websites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Draft',
  pages INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view websites" ON public.websites FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can insert websites" ON public.websites FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update websites" ON public.websites FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete websites" ON public.websites FOR DELETE TO authenticated USING (public.is_admin());

CREATE TRIGGER update_websites_updated_at BEFORE UPDATE ON public.websites FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
