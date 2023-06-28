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

export const followContent = async (
  supabase,
  { contentId, userId },
  onSuccess,
  onErrors,
  onFinally
) => {
  try {
    const { data, error } = await supabase
      .from("follows")
      .insert([{ user_id: userId, content_id: contentId }], {
        returning: "minimal",
      });

    if (error) throw error;
    if (onSuccess) onSuccess(data);
  } catch (error) {
    if (onErrors) onErrors(error);
  } finally {
    if (onFinally) onFinally();
  }
};

export const unfollowContent = async (
  supabase,
  { contentId, userId },
  onSuccess,
  onErrors,
  onFinally
) => {
  try {
    const { data, error } = await supabase
      .from("follows")
      .delete()
      .match(
        { user_id: userId, content_id: contentId },
        { returning: "minimal" }
      );

    if (error) throw error;
    if (onSuccess) onSuccess(data);
  } catch (error) {
    if (onErrors) onErrors(error);
  } finally {
    if (onFinally) onFinally();
  }
};

export const likeContent = async (
  supabase,
  { contentId, userId },
  onSuccess,
  onErrors,
  onFinally
) => {
  try {
    const { data, error } = await supabase
      .from("likes")
      .insert([{ user_id: userId, content_id: contentId }], {
        returning: "minimal",
      });
    if (error) throw error;
    if (onSuccess) onSuccess(data);
  } catch (error) {
    if (onErrors) onErrors(error);
  } finally {
    if (onFinally) onFinally();
  }
};

export const unlikeContent = async (
  supabase,
  { contentId, userId },
  onSuccess,
  onErrors,
  onFinally
) => {
  try {
    const { data, error } = await supabase
      .from("likes")
      .delete()
      .match(
        { user_id: userId, content_id: contentId },
        { returning: "minimal" }
      );

    if (error) throw error;
    if (onSuccess) onSuccess(data);
  } catch (error) {
    if (onErrors) onErrors(error);
  } finally {
    if (onFinally) onFinally();
  }
};

export const addLastWatched = async (
  supabase,
  { user_id, content_id, episode_id, time }
) => {
  const { data } = await supabase
    .from("progress")
    .select("last_watched, time")
    .eq("user_id", user_id)
    .eq("content_id", content_id)
    .limit(1);

  if (data.length === 0) {
    console.log("CREATE");
    await supabase
      .from("progress")
      .insert({
        user_id,
        content_id,
        last_watched: episode_id,
        time,
        timestamp: Date.now(),
      });
  } else {
    const current = data[0];

    if (current.last_watched !== episode_id || current.time !== time) {
      console.log("UPDATE");
      await supabase
        .from("progress")
        .update({ last_watched: episode_id, time, timestamp: Date.now() })
        .eq("user_id", user_id)
        .eq("content_id", content_id);
    }
  }
};
