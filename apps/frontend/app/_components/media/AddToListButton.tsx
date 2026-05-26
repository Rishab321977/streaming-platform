"use client"

import { toggleMediaInList } from "@/app/_lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { signIn, useSession } from "next-auth/react"

interface AddToListButtonProps {
  mediaId: string
  initialIsInList?: boolean
}

export function AddToListButton({
  mediaId,
  initialIsInList = false,
}: AddToListButtonProps) {
const { data: session, status } = useSession();
  const queryClient = useQueryClient()

  const userId = session?.user?.id;
  const queryKey = ["myList", userId, mediaId]

  const mutation = useMutation({
    mutationFn: () => toggleMediaInList(mediaId, session?.accessToken as string),

    // 1. ON MUTATE: Fired immediately when the button is clicked, BEFORE the network request
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })

      const previousState = queryClient.getQueryData(queryKey)

      const newState =
        previousState !== undefined ? !previousState : !initialIsInList
      queryClient.setQueryData(queryKey, newState)

      return { previousState }
    },

    onError: (err, variables, context) => {
      if (context?.previousState !== undefined) {
        queryClient.setQueryData(queryKey, context.previousState)
      }
      console.error("Optimistic update failed, rolled back.", err)
    },

    onSettled: () => {
      // Invalidate the query to ensure our cache is strictly synced with the server
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const handleToggle = () => {
    if (status === "unauthenticated") {
      // Force user to login if they click while signed out
      signIn('github');
      return;
    }
    mutation.mutate();
  };

  const isInList =
    queryClient.getQueryData<boolean>(queryKey) ?? initialIsInList

  return (
    <button
      onClick={handleToggle}
      disabled={mutation.isPending && !mutation.context}
      className={`px-4 py-2 rounded-md font-medium transition-colors ${
        isInList
          ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          : "bg-primary text-primary-foreground hover:bg-primary/90"
      }`}
    >
      {isInList ? "✓ In My List" : "+ Add to My List"}
    </button>
  )
}
