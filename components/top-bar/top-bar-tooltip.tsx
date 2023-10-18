import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TopBarTooltipProps {
  children: React.ReactNode,
  content: string
}

const TopBarTooltip = (props: TopBarTooltipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {props.children}
      </TooltipTrigger>
      <TooltipContent>
        <p>{props.content}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default TopBarTooltip;