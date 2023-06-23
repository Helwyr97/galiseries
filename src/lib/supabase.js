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

export const signUp = async (
  supabase,
  { email, password },
  onSuccess,
  onErrors,
  onFinally
) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", email);
    if (error) throw error;
    if (data.length > 0) throw new Error("O usuario xa existe");

    const {
      data: { user },
      error: signUpError,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) throw signUpError;

    const { id } = user;

    const { error: profileError } = await supabase
      .from("profiles")
      .insert([{ user_id: id, role_id: 1, email: email }]);

    if (profileError) throw profileError;
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
