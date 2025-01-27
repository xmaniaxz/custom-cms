"use client"
import SiteComponent from "@/components/sitecomponent";
import SlidingMenu from "@/components/sidemenu";
import { GetAllBucketFiles } from "@/components/node-appwrite";
import { useEffect, useState } from "react";
import { loadComponents } from "next/dist/server/load-components";
export default function WebsitePage() {
  const [ComponentList, setComponentList] = useState<any[]>([
  ]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const AddComponent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (formData.get("componentName") === "" || ComponentList.some(component => component.props.componentName === formData.get("componentName"))){
      console.log("Component name is empty or already exists");
      setIsMenuOpen(false);
      return;
    }
    setComponentList([
      ...ComponentList,
      <SiteComponent componentName={formData.get("componentName") as string} />,
    ]);
    setIsMenuOpen(false);
  };

  const HandleComponent = () => {
    isMenuOpen ? setIsMenuOpen(false) : setIsMenuOpen(true);
  };

  const RemoveComponent = (index: number) => {
    let list = ComponentList;
    list.splice(index, 1);
    setComponentList([...list]);
  };

  const LoadComponents = async () => {
      const components = await GetAllBucketFiles("677d1aad0014801461d2");
      components.map((component) => {
        setComponentList([
          ...ComponentList,
          <SiteComponent componentName={component.name} />,
        ]);
      });
  }

  useEffect(() => {
    LoadComponents();
  }, []);

  return (
    <div>
      <div
        className={`fixed top-0 left-0 w-screen h-screen bg-black ${
          isMenuOpen ? "bg-opacity-40 z-[1000]" : "bg-opacity-0 z-[-1]"
        }`}
        onClick={() => {
          if (isMenuOpen) setIsMenuOpen(false);
        }}
      />
      <SlidingMenu
        isMenuOpen={isMenuOpen}
        position="center"
        width="40%"
        height="10vh"
      >
        <form
          className="flex flex-col gap-y-8"
          onSubmit={(e) => {
            AddComponent(e);
          }}
        >
          <div className="flex justify-between p-x-2">
            <h1>Menu</h1>{" "}
            <button
              className="Icon text-[32px]"
              onClick={() => setIsMenuOpen(false)}
              type="button"
            >
              close
            </button>
          </div>

          <input type="text" name="componentName" placeholder="new component" />
          <br />
          <button className="btn" type="submit">
            Add component
          </button>
        </form>
      </SlidingMenu>
      <button
      className="fixed btn flex items-center px-4 py-1 justify-center"
        onClick={() => {
          HandleComponent();
        }}
      >
        <i className="Icon">add</i> new
      </button>
      <section className="flex flex-col w-screen gap-y-4">
        {ComponentList.map((component, index) => (
          <div key={index}>
            {component}
            <button
              className="Icon ml-24 btn p-1 text-[24px]"
              onClick={() => {
                RemoveComponent(index);
              }}
            >
              delete
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
