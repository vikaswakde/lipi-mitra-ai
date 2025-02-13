/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from "@/utils/uploadthing";
import { Loader2Icon, MicIcon, SquareIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import Timer from "./Timer";

const START_SOUND = "/sounds/start.mp3";
const PAUSE_SOUND = "/sounds/stop.mp3";
const RESUME_SOUND = "/sounds/start.mp3";
const STOP_SOUND = "/sounds/stop.mp3";

interface AudioRecorderProps {
  onRecordingComplete: (audioUrl: string) => void;
  onRecordingStart: () => void;
  onRecordingPause: () => void;
  onRecordingResume: () => void;
  maxDuration?: number;
  isDisabled?: boolean;
  isLastQuestion: boolean;
  isPaused: boolean;
}

export default function AudioRecorder({
  onRecordingComplete,
  onRecordingStart,
  onRecordingPause,
  onRecordingResume,
  maxDuration = 60,
  isDisabled,
  isLastQuestion,
  isPaused,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const { startUpload } = useUploadThing("audioUploader");

  const startSoundRef = useRef<HTMLAudioElement | null>(null);
  const pauseSoundRef = useRef<HTMLAudioElement | null>(null);
  const resumeSoundRef = useRef<HTMLAudioElement | null>(null);
  const stopSoundRef = useRef<HTMLAudioElement | null>(null);

  const handleUpload = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);

      // Convert blob to File object
      const file = new File([audioBlob], "recording.webm", {
        type: "audio/webm",
      });

      const uploadResponse = await startUpload([file]);

      if (!uploadResponse?.[0]?.url) {
        throw new Error("Upload failed");
      }

      onRecordingComplete(uploadResponse[0].url);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error uploading audio",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const startSession = async () => {
    try {
      startSoundRef.current?.play();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      onRecordingStart();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Error Starting Session",
        description: "Failed to access microphone",
        variant: "destructive",
      });
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      pauseSoundRef.current?.play();
      mediaRecorderRef.current.pause();
      onRecordingPause();
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      resumeSoundRef.current?.play();
      mediaRecorderRef.current.resume();
      onRecordingResume();
    }
  };

  const stopSession = () => {
    if (mediaRecorderRef.current && isRecording) {
      stopSoundRef.current?.play();
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Clean up stream tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        handleUpload(audioBlob);
      };
    }
  };

  return (
    <div className="space-y-4">
      <audio ref={startSoundRef} src={START_SOUND} preload="auto" />
      <audio ref={pauseSoundRef} src={PAUSE_SOUND} preload="auto" />
      <audio ref={resumeSoundRef} src={RESUME_SOUND} preload="auto" />
      <audio ref={stopSoundRef} src={STOP_SOUND} preload="auto" />

      <div className="flex justify-center gap-2">
        {!isRecording && !isPaused ? (
          <Button
            onClick={startSession}
            disabled={isProcessing || isDisabled}
            size="lg"
            className="gap-2 rounded-2xl bg-purple-700/70 hover:bg-purple-600/60 shadow-lg"
          >
            {isProcessing ? (
              <Loader2Icon className="w-4 h-4 animate-spin" />
            ) : (
              <MicIcon className="w-4 h-4" />
            )}
            Start Recording
          </Button>
        ) : isPaused ? (
          <Button
            onClick={resumeRecording}
            size="lg"
            className="gap-2 rounded-2xl bg-purple-700/70 hover:bg-purple-600/60 shadow-lg"
          >
            <MicIcon className="w-4 h-4" />
            {/* This actaully resumes' but we palyed a trick  */}
            Start Recording
          </Button>
        ) : isLastQuestion ? (
          <Button
            onClick={stopSession}
            variant="destructive"
            size="lg"
            className="gap-2 rounded-2xl shadow-sm border border-purple-500/10"
          >
            <SquareIcon className="w-4 h-4" />
            Stop Session
          </Button>
        ) : (
          <Button
            onClick={pauseRecording}
            variant="destructive"
            size="lg"
            className="gap-2 rounded-2xl shadow-sm border border-purple-500/10"
          >
            <SquareIcon className="w-4 h-4" />
            Done
          </Button>
        )}
      </div>
    </div>
  );
}
