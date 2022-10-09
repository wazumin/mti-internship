import {
  Avatar,
  Badge,
  Button,
  Indicator,
  Paper,
  Modal,
  ScrollArea,
} from "@mantine/core"
import React, { useCallback, useEffect, useState } from "react"
import { ChatCreateButton } from "../components/ChatCreateButton"
import { ChatItemGoodButton } from "../components/ChatItemGoodButton"
import { Layout } from "../components/Layout"
import { Chat } from "../types/chat"
import { supabase } from "../utils/supabase"

// 全体チャットページ
const Chat = () => {
  const [chats, setChats] = useState<Chat[]>([])

  // チャット一覧を取得し、chatsに格納
  const getChats = useCallback(async () => {
    const { data, error, status } = await supabase
      .from<Chat>("chats")
      .select("*")
    if (error) {
      throw error
    }
    if (data) {
      setChats(data)
    }
  }, [])

  useEffect(() => {
    getChats()
    // 変更を検知して再度getChatsする
    const chatsListener = supabase
      .from("chats")
      .on("INSERT", payload => {
        getChats()
      })
      .subscribe()
    return () => {
      chatsListener.unsubscribe()
    }
  }, [])

  return (
    <Layout>
      <div className='flex justify-between items-center'>
        <h1>タイムライン</h1>
        <ChatCreateButton />
      </div>

      <ScrollArea scrollHideDelay={300} className='h-[calc(100vh-210px)] mt-3'>
        <div className='flex flex-col mt-4 gap-6'>
          {chats?.map(chat => (
            <div key={chat.id} className='flex gap-3 items-start'>
              <Indicator
                inline
                label=''
                size={16}
                offset={7} // 内側に7
                color='green'
                position='bottom-end'
                withBorder // 外側の白
                processing // 主張激しくなる
              >
                <Avatar
                  size='lg'
                  radius='xl'
                  className='transform duration-300 hover:scale-105'
                  src='https://source.unsplash.com/random'
                />
              </Indicator>
              <div>
                <p>{chat.user_name}</p>
                <Paper shadow='sm' p='sm' className='min-w-200px max-w-400px'>
                  <div className='whitespace-pre-wrap'>{chat.message}</div>
                  <div className='mt-2'>
                    <ChatItemGoodButton chat={chat} />
                  </div>
                </Paper>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Layout>
  )
}

export default Chat
