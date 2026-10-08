-- "HK Wiki" app: drop PDFs or a folder on it to add papers; open it to get the hk menu.
-- Built by `hk install` (osacompile) into ~/Applications/HK Wiki.app.

on run
	tell application "Terminal"
		activate
		do script "bash ~/cryo-em/byeori/hk.sh"
	end tell
end run

on open droppedItems
	set args to ""
	repeat with anItem in droppedItems
		set args to args & " " & quoted form of (POSIX path of anItem)
	end repeat
	tell application "Terminal"
		activate
		do script "bash ~/cryo-em/byeori/hk.sh add" & args
	end tell
end open
