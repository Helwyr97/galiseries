export const login = async (
  supabase,
  { email, password },
  onSuccess,
  onErrors,
  onFinally
) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    onSuccess();
  } catch (error) {
    if (onErrors) onErrors(error);
  } finally {
    if (onFinally) onFinally();
  }
};

export const logout = async (supabase, onSuccess) => {
  await supabase.auth.signOut();
  onSuccess();
};
