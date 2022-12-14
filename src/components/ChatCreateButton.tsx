import { Button, LoadingOverlay, Modal, Stack, Textarea } from "@mantine/core"
import { useForm } from "@mantine/form"
import { FC, useCallback, useEffect, useState } from "react"
import { useGetApi, useSelectEq } from "../hooks/useGetApi"
import { useIsLoggedIn } from "../hooks/useIsLoggedIn"
import { ChatFormParams } from "../types/chat"
import { supabase } from "../utils/supabase"

// ログインしていないなら押せなくする
export const ChatCreateButton: FC = () => {
  const [opened, setOpened] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const session = useIsLoggedIn()

  const form = useForm<ChatFormParams>({
    initialValues: {
      user_id: "",
      user_name: "",
      message: "",
    },
    validate: {
      message: (v: string) => (v === "" ? "メッセージを入力して下さい" : null),
    },
  })

  const { data: userName } = useSelectEq<{ name: string }>("profiles", {
    select: "name",
    column: "user_id",
    value: session?.user?.id,
  })
  console.log("user_name22", userName)

  // session, userNameが変わると、再計算する
  const getUserName = useCallback(async () => {
    if (!session || !userName) {
      return
    }
    form.setValues({
      user_id: session.user?.id,
      user_name: userName[0].name,
      message: "",
    })
  }, [session, userName])

  // 初回とgetUserNameの結果が変わる度に実行
  useEffect(() => {
    getUserName()
  }, [getUserName])

  const createChat = useCallback(async () => {
    const { error } = await supabase.from("chats").insert(form.values, {
      returning: "minimal", //返り値を無くす
    })

    if (error) {
      throw new Error(error.message)
    }
    console.log("投稿に成功しました", form.values)
  }, [form.values])

  const onSubmit = useCallback(async () => {
    console.log(form.values)
    setIsLoading(true)
    await createChat()

    setTimeout(() => {
      setIsLoading(false)
      setOpened(false)
      form.reset()
    }, 300)
  }, [form, createChat])

  if (!session) {
    return <></>
  }

  return (
    <div>
      <Button onClick={() => setOpened(true)}>投稿する</Button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title='投稿メッセージを入力して下さい'
      >
        <form onSubmit={form.onSubmit(onSubmit)}>
          <LoadingOverlay
            loaderProps={{ size: "md", color: "blue", variant: "oval" }}
            overlayOpacity={0.5}
            overlayColor='#c5c5c5'
            visible={isLoading}
          />

          <Stack spacing='md'>
            <Textarea
              placeholder='今日も禁煙がんばるぞ！'
              autosize
              minRows={3}
              {...form.getInputProps("message")}
            />
            <div className='flex justify-end'>
              <Button type='submit'>送信</Button>
            </div>
          </Stack>
        </form>
      </Modal>
    </div>
  )
}
