import { showNavbarState } from "@/state/states";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Progress,
  Spacer,
  Spinner,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import Hls from "hls.js";
import {
  FaPause,
  FaPlay,
  FaArrowLeft,
  FaFastForward,
  FaForward,
  FaBackward,
  FaExpand,
  FaCompress,
  FaFastBackward,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import Link from "next/link";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import Head from "next/head";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { addLastWatched } from "@/lib/supabase";
import { secondsToHHMMSS } from "@/lib/auxFunctions";

const Player = ({ content }) => {
  let playerRef = useRef();
  const pageRef = useRef();
  const intervalRef = useRef();
  const mouseTimeout = useRef();

  const user = useUser();
  const supabase = useSupabaseClient();

  const setShowNavbar = useSetRecoilState(showNavbarState);

  const [showControls, setShowControls] = useState(true);
  const [waiting, setWaiting] = useState(false);
  const [time, setTime] = useState({ current: 0, total: 0 });
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const stopPropagation = (event) => event.stopPropagation();

  const handleTogglePlay = useCallback(
    (event) => {
      if (event) event.stopPropagation();
      if (playing) {
        playerRef.current?.pause();
      } else {
        playerRef.current?.play();
      }
      setPlaying((cur) => !cur);
    },
    [playing]
  );

  const backward = useCallback(() => {
    if (playerRef.current && playerRef.current.currentTime >= 10) {
      playerRef.current.currentTime -= 10;
    } else {
      playerRef.current.currentTime = 0;
    }
  }, []);

  const forward = useCallback(() => {
    if (
      playerRef.current &&
      playerRef.current.currentTime <= playerRef.current.duration - 10
    ) {
      playerRef.current.currentTime += 10;
    } else {
      playerRef.current.currentTime = playerRef.current.duration;
    }
  }, []);

  const handleMute = useCallback(() => {
    if (!playerRef.current) return;
    if (muted) {
      setMuted(false);
      playerRef.current.volume = 1;
    } else {
      setMuted(true);
      playerRef.current.volume = 0;
    }
  }, [muted]);

  const seek = (event) => {
    let { left, width } = event.target.getBoundingClientRect();
    const percent =
      event.target.role === "progressbar"
        ? (event.pageX - left) / ((width / event.target.ariaValueNow) * 100)
        : (event.pageX - left) / width;
    const currentAudio = playerRef.current;

    if (currentAudio !== null) {
      const newCurrent = currentAudio.duration * percent;
      currentAudio.currentTime = newCurrent;
      setTime({
        current: newCurrent,
        total: currentAudio.duration,
      });
    }
  };

  const hideControls = () => {
    setShowControls(false);
  };

  const _showControls = () => {
    setShowControls(true);
  };

  const checkMouseMove = () => {
    if (!showControls) {
      setShowControls(true);
    } else {
      clearInterval(mouseTimeout.current);
      mouseTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 1500);
    }
  };

  const handleFullScreen = (event) => {
    event.stopPropagation();

    if (fullscreen) {
      document.exitFullscreen();
      setFullscreen(false);
    } else {
      if (document.body.requestFullScreen) {
        document.body.requestFullScreen();
      } else if (document.body.webkitRequestFullScreen) {
        document.body.webkitRequestFullScreen();
      } else if (document.body.mozRequestFullScreen) {
        document.body.mozRequestFullScreen();
      }
      setFullscreen(true);
    }
  };

  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTime({
        current: playerRef.current?.currentTime,
        total: playerRef.current?.duration,
      });
    }, 100);
  };

  // Ocultar navbar y guardar progreso si hay usuario
  useEffect(() => {
    setShowNavbar(false);

    return () => setShowNavbar(true);
  }, []);

  useEffect(() => {
    if (user.id && Math.floor(time.current) % 30 === 0) {
      addLastWatched(supabase, {
        user_id: user.id,
        content_id: content.content_id,
        episode_id: content.id,
        time: Math.floor(time.current),
      });
    }
  }, [time.current, user.id, content.content_id, content.id]);

  // Load player
  useEffect(() => {
    if (content === null) return;

    const video = playerRef.current;
    if (!video) return;

    const defaultOptions = {};

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = content.url;
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(content.url);
      // const player = new Plyr(video, defaultOptions);
      hls.attachMedia(video);
    } else {
      console.error(
        "This is an old browser that does not support MSE https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API"
      );
    }
  }, [content, playerRef]);

  // FullScreen Events
  useEffect(() => {
    function onFullscreenChange() {
      setFullscreen(Boolean(document.fullscreenElement));
    }

    function onKeyDown(event) {
      if (event.key === "F11") {
        event.preventDefault();
      }
    }

    const eventTypes = [
      "fullscreenchange",
      "webkitfullscreenchange",
      "mozfullscreenchange",
      "msfullscreenchange",
    ];

    eventTypes.forEach((eventType) =>
      document.addEventListener(eventType, onFullscreenChange, false)
    );

    document.addEventListener("keydown", onKeyDown, false);

    return () => {
      eventTypes.forEach((eventType) =>
        document.removeEventListener(eventType, onFullscreenChange, false)
      );
      document.removeEventListener("keydown", onKeyDown, false);
    };
  }, []);

  // Handle playing to start playing state timer
  useEffect(() => {
    if (playing) {
      startTimer();
    } else {
      clearInterval(intervalRef.current);
    }
  }, [playing]);

  // Player waiting buffer events
  useEffect(() => {
    const player = playerRef.current;

    if (!player) return;

    player.addEventListener("waiting", () => setWaiting(true), false);
    player.addEventListener("playing", () => setWaiting(false), false);
    return () => {
      player.removeEventListener("waiting", () => setWaiting(true), false);
      player.removeEventListener("playing", () => setWaiting(false), false);
    };
  }, [playerRef]);

  // Key ShortCuts
  useEffect(() => {
    const onKeyDown = (event) => {
      const { keyCode } = event;

      // SPACE
      if (keyCode === 32) return handleTogglePlay(null);
      // <- Arrow
      if (keyCode === 37) return backward();
      // -> Arrow
      if (keyCode === 39) return forward();
      // M
      if (keyCode === 77) return handleMute();
    };
    document.addEventListener("keydown", onKeyDown, false);
    return () => document.removeEventListener("keydown", onKeyDown, false);
  }, [handleTogglePlay, handleMute, backward, forward]);

  if (!content)
    return (
      <Flex
        backgroundColor="black"
        mt={-16}
        mx={-10}
        h={"100vh"}
        w={"100vw"}
        justifyContent="center"
        alignItems="center"
      >
        <Spinner size={"xl"} />
      </Flex>
    );

  return (
    <>
      <Head>
        <title>
          {content.contents.title} : {content.title}
        </title>
      </Head>
      <Box
        ref={pageRef}
        mt={-16}
        mx={-10}
        h={"100vh"}
        w={"100vw"}
        cursor={showControls ? "auto" : "none"}
        userSelect={"none"}
      >
        <video
          ref={playerRef}
          controls={false}
          style={{
            height: "100%",
            width: "100%",
            margin: "0px",
            padding: "0px",
            backgroundColor: "black",
          }}
        ></video>
        <Box
          position={"absolute"}
          top={0}
          left={0}
          h={"100%"}
          w={"100%"}
          m={0}
          p={0}
          onClick={handleTogglePlay}
          onDoubleClick={handleFullScreen}
          onMouseLeave={hideControls}
          onMouseEnter={_showControls}
          onMouseMove={checkMouseMove}
        >
          <IconButton
            visibility={showControls ? "visible" : "hidden"}
            opacity={showControls ? "1" : "0"}
            transition={"all 1.5s"}
            icon={<FaArrowLeft />}
            size={"lg"}
            position={"absolute"}
            mt={2}
            ml={2}
            as={Link}
            href={"/contents/" + content.content_id}
          />
          <Spinner
            visibility={waiting ? "visible" : "hidden"}
            size={"lg"}
            position={"absolute"}
            margin={"auto"}
            left={0}
            right={0}
            top={0}
            bottom={0}
          />
          <Box
            visibility={showControls ? "visible" : "hidden"}
            opacity={showControls ? "1" : "0"}
            transition={"all 1.5s"}
            position={"absolute"}
            bottom={0}
            p={2}
            w={"full"}
            backgroundColor="blackAlpha.600"
            onClick={stopPropagation}
            onDoubleClick={stopPropagation}
          >
            <Text textAlign={"center"} fontSize={"xl"}>
              {content.title}
            </Text>
            <HStack p={2}>
              <Box minWidth={90} textAlign={"left"}>
                {secondsToHHMMSS(time.current, time.total < 3600)}
              </Box>
              <Progress
                value={time.total === 0 ? 0 : (time.current / time.total) * 100}
                colorScheme="pink"
                w="full"
                onClick={seek}
              />
              <Box minWidth={88} textAlign={"right"}>
                {secondsToHHMMSS(time.total, true)}
              </Box>
            </HStack>
            <Flex>
              <IconButton
                icon={muted ? <FaVolumeMute /> : <FaVolumeUp />}
                size={"lg"}
                variant={"ghost"}
                onClick={handleMute}
              />
              <Spacer />
              <Tooltip label="Previous Episode" hasArrow placement="top">
                <IconButton
                  icon={<FaFastBackward />}
                  isDisabled={content.prev === null}
                  size={"lg"}
                  variant={"ghost"}
                  // onClick={() => navigate('/player/episode/'+content.prev.id)}
                />
              </Tooltip>
              <Tooltip label="Backward" hasArrow placement="top">
                <IconButton
                  icon={<FaBackward />}
                  size={"lg"}
                  variant={"ghost"}
                  onClick={backward}
                />
              </Tooltip>
              <Tooltip
                label={playing ? "Pause" : "Play"}
                hasArrow
                placement="top"
              >
                <IconButton
                  icon={playing ? <FaPause /> : <FaPlay />}
                  size={"lg"}
                  variant={"ghost"}
                  onClick={handleTogglePlay}
                />
              </Tooltip>
              <Tooltip label="Forward" hasArrow placement="top">
                <IconButton
                  icon={<FaForward />}
                  size={"lg"}
                  variant={"ghost"}
                  onClick={forward}
                />
              </Tooltip>
              <Tooltip label="Next Episode" hasArrow placement="top">
                <IconButton
                  icon={<FaFastForward />}
                  isDisabled={content.next === null}
                  size={"lg"}
                  variant={"ghost"}
                  // onClick={() => navigate('/player/episode/'+content.next.id)}
                />
              </Tooltip>
              <Spacer />
              <IconButton
                icon={fullscreen ? <FaCompress /> : <FaExpand />}
                size={"lg"}
                variant={"ghost"}
                onClick={handleFullScreen}
              />
            </Flex>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export const getServerSideProps = async (ctx) => {
  const { id } = ctx.query;
  const supabase = createPagesServerClient(ctx);
  const { data } = await supabase
    .from("episodes")
    .select("*, contents (id, title, banner)")
    .eq("id", id)
    .limit(1)
    .single();

  if (!data) return { notFound: true };

  const { data: prev } = await supabase
    .from("episodes")
    .select("id, title")
    .eq("id", data.id - 1)
    .eq("content_id", data.content_id)
    .limit(1);

  const { data: next } = await supabase
    .from("episodes")
    .select("id, title")
    .eq("id", data.id + 1)
    .eq("content_id", data.content_id)
    .limit(1);

  return {
    props: {
      content: {
        ...data,
        prev: prev.length === 0 ? null : prev[0],
        next: next.length === 0 ? null : next[0],
      },
    },
  };
};

export default Player;
