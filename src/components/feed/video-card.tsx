import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/cards/card"
import { MoreHorizontal, Eye, Heart, MessageSquare, Play } from 'lucide-react'

interface VideoCardProps {
  author: {
    name: string
    avatarUrl: string
    timestamp: string
  }
  content: string
  videoThumbnail: string
  likes: number
  views: number
  comments: number
}

export function VideoCard({ author, content, videoThumbnail, likes, views, comments }: VideoCardProps) {
  return (
    <Card className="rounded-xl shadow-sm dark:bg-gray-900 dark:text-gray-100">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={author.avatarUrl} />
          <AvatarFallback>{author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{author.name}</h3>
          <p className="text-sm text-gray-400">{author.timestamp}</p>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-100 dark:hover:text-white">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-900">{content}</p>
        <div className="relative aspect-video rounded-xl overflow-hidden">
          <img
            src={videoThumbnail}
            alt="Video thumbnail"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Button size="icon" variant="ghost" className="h-12 w-12 rounded-full bg-white/90 hover:bg-white text-primary dark:bg-gray-700 dark:text-gray-100">
              <Play className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 border-gray-700">
        <div className="flex gap-4">
          <Button variant="ghost" size="sm" className="gap-1 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white">
            <Heart className="w-4 h-4" />
            {likes}
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white">
            <Eye className="w-4 h-4" />
            {views}
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white">
            <MessageSquare className="w-4 h-4" />
            {comments}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
